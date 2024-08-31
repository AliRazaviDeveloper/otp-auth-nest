import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { OtpEntity } from '../user/entities/otp.entity';
import { CheckOtpDto, LoginDto, RegisterDto, SendOtpDto } from './dto/auth.dto';
import { randomInt } from 'crypto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HashPasswordService } from 'src/common/utils/password';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly hashPasswordService: HashPasswordService,
  ) {}

  async sendOtp(sendOtpDto: SendOtpDto) {
    const { phone } = sendOtpDto;
    const user = await this.findOrCreateUser(phone);
    const code = this.generateOtpCode();
    const expire_in = this.generateOtpExpiry();

    const existingOtp = await this.getOtp(user.id);
    if (existingOtp && !this.isExpireOtpCode(existingOtp.expire_in)) {
      throw new BadRequestException(
        'کد تایید فعالی وجود دارد. لطفاً دو دقیقه صبر کنید و سپس مجدداً تلاش نمایید.',
      );
    }

    const otp = existingOtp
      ? await this.updateOtp(existingOtp.id, code, expire_in, user.id)
      : await this.createOtp(code, expire_in, user.id);

    user.otp_id = otp.id;
    await this.userRepository.save(user);

    return { message: 'کد تایید با موفقیت ارسال شد' };
  }

  async register(body: RegisterDto) {
    const { phone, email, password, confirmPassword } = body;
    if (password !== confirmPassword) {
      throw new BadRequestException('رمز عبور و تکرار آن یکسان نیستند');
    }
    const findUserWithEmail = await this.findUser({
      email,
    });
    if (findUserWithEmail) {
      throw new ConflictException('ایمیل وارد شده قبلاً ثبت شده است');
    }
    const findUserWithPhone = await this.findUser({
      phone,
    });
    if (findUserWithPhone) {
      throw new ConflictException('شماره موبایل وارد شده قبلاً ثبت شده است');
    }

    const hashPassword = await this.hashPasswordService.hashPassword(password);
    const user = await this.userRepository.create({
      phone,
      email,
      password: hashPassword,
    });

    await this.userRepository.save(user);
    return { message: 'ثبت نام با موفقیت انجام شد' };
  }

  async login(body: LoginDto) {
    const { email, password } = body;
    const user = await this.findUser({ email });
    console.log(user.phone);

    if (!user) {
      throw new NotFoundException('کاربری با این ایمیل یافت نشد');
    }

    const isPasswordValid = await this.hashPasswordService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('رمز عبور نادرست است');
    }

    const accessToken = await this.createTokenWithPayload(
      {
        id: user.id,
        phone: user.phone,
      },
      this.configService.get('jwt.accessToken'),
    );
    const refreshToken = await this.createTokenWithPayload(
      {
        id: user.id,
        phone: user.phone,
      },
      this.configService.get('jwt.refreshToken'),
    );

    return {
      accessToken,
      refreshToken,
      message: 'کاربر با موفقیت وارد اکانت خود شد .',
    };
  }

  private async findOrCreateUser(phone: string): Promise<UserEntity> {
    let user = await this.userRepository.findOne({
      where: { phone },
      relations: ['otp'],
    });
    if (!user) {
      user = this.userRepository.create({ phone });
      await this.userRepository.save(user);
    }
    return user;
  }

  private generateOtpCode(): string {
    return randomInt(100000, 999999).toString();
  }

  private generateOtpExpiry(): Date {
    return new Date(Date.now() + 60 * 60 * 1000);
  }

  private async createOtp(otp: string, expire_in: Date, userId: number) {
    const newOtp = this.otpRepository.create({
      otp,
      expire_in,
      userId,
    });
    return await this.otpRepository.save(newOtp);
  }

  private async updateOtp(
    otpId: number,
    otp: string,
    expire_in: Date,
    userId: number,
  ) {
    await this.otpRepository.update(otpId, {
      otp,
      expire_in,
      userId,
    });
    return await this.otpRepository.findOne({ where: { id: otpId } });
  }

  private async getOtp(userId: number) {
    return await this.otpRepository.findOne({
      where: { userId },
    });
  }

  private isExpireOtpCode(expire_in: Date): boolean {
    const currentTime = new Date();
    return currentTime > expire_in;
  }

  private async removeAllOtpUser(userId: number) {
    return await this.otpRepository.delete({
      userId,
    });
  }

  async checkOtp(checkOtpDto: CheckOtpDto) {
    const { otp, phone } = checkOtpDto;
    const user = await this.userService.findByPhone(phone);

    if (!user) throw new UnauthorizedException('شماره موبایل یافت نشد .');
    const otpCode = await this.getOtp(user.id);
    if (!otpCode) throw new UnauthorizedException('کد یافت نشد .');

    if (otpCode.otp !== otp)
      throw new UnauthorizedException('کد وارد شده اشتباه است .');

    if (this.isExpireOtpCode(otpCode.expire_in)) {
      await this.removeAllOtpUser(user.id);
      throw new UnauthorizedException('کد منقضی شده است .');
    }
    await this.removeAllOtpUser(user.id);
    if (!user.verify_at) {
      await this.userService.verifyUser(user.id);
    }

    const accessToken = await this.createTokenWithPayload(
      {
        id: user.id,
        phone: user.phone,
      },
      this.configService.get('jwt.accessToken'),
    );

    const refreshToken = await this.createTokenWithPayload(
      {
        id: user.id,
        phone: user.phone,
      },
      this.configService.get('jwt.refreshToken'),
      '1y',
    );

    return {
      accessToken,
      refreshToken,
      message: 'کد شما معتبر است .',
    };
  }

  private async createTokenWithPayload(
    payload: { id: number; phone: string },
    secretKey: string,
    expiredIn: string = '1d',
  ) {
    return await this.jwtService.sign(
      { id: payload.id, phone: payload.phone },
      {
        secret: secretKey,
        expiresIn: expiredIn,
      },
    );
  }

  async verifyToken(token: string) {
    try {
      return await this.jwtService.verify(token, {
        secret: this.configService.get('jwt.accessToken'),
      });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async findUser(criteria: { id?: number; email?: string; phone?: string }) {
    return await this.userRepository.findOne({
      where: criteria,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone: true,
        email: true,
        verify_at: true,
        password: true,
        created_at: true,
        updated_at: true,
      },
    });
  }
}
