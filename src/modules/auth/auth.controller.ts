import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckOtpDto, LoginDto, RegisterDto, SendOtpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/send-otp')
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto);
  }
  @Post('/check-otp')
  async checkOtp(@Body() checkOtpDto: CheckOtpDto) {
    return this.authService.checkOtp(checkOtpDto);
  }
  @Post('/register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
  @Post('/login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
