import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class ConfirmPasswordConstraint implements ValidatorConstraintInterface {
  validate(
    confirmPassword: any,
    args?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const [relatedPropertyName] = args.constraints;
    const password = (args.object as any)[relatedPropertyName];
    return password === confirmPassword;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return 'password and confirmPassword must be same';
  }
}

export function IsPasswordConfirm(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: ConfirmPasswordConstraint,
    });
  };
}
