import { IsMobilePhone, Length } from 'class-validator';

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
