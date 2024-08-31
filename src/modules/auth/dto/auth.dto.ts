import { IsEmail, IsMobilePhone, Length } from 'class-validator';

export class SendOtpDto {
  @IsMobilePhone('fa-IR')
  phone: string;
}

export class CheckOtpDto {
  @IsMobilePhone(
    'fa-IR',
    {},
    { message: 'شماره موبایل وارد شده معتبر نمی باشد' },
  )
  phone: string;
  @Length(6, 6, { message: 'کد وارد شده 5 رقمی نمی باشد' })
  otp: string;
}

export class RegisterDto {
  @IsEmail({}, { message: 'ایمیل وارد شده معتبر نمی باشد' })
  email: string;
  @IsMobilePhone(
    'fa-IR',
    {},
    { message: 'شماره موبایل وارد شده معتبر نمی باشد' },
  )
  phone: string;
  @Length(8, 20, { message: 'کلمه عبور 8 تا 20 کاراکتر می باشد' })
  password: string;
  @Length(8, 20, { message: 'تکرار کلمه عبور 8 تا 20 کاراکتر می باشد' })
  confirmPassword: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'ایمیل وارد شده معتبر نمی باشد' })
  email: string;
  @Length(8, 20, { message: 'کلمه عبور 8 تا 20 کاراکتر می باشد' })
  password: string;
}
