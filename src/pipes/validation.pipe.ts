import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import {
  validate,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const constraints = errors.map(m => m.constraints);

      if (constraints.length > 0) {
        const constraint = constraints[0];
        const message = Object.keys(constraint).map(key => constraint[key]);
        throw new BadRequestException(message[message.length - 1]);
      }

      throw new BadRequestException('Validation Fail.');
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

export function IsComparePassword(
  property: string,
  validationOptions?: ValidationOptions,
) {
  // tslint:disable-next-line:ban-types
  return (object: Object, propertyName: string) => {
    if (validationOptions === undefined) {
      validationOptions = {};
      validationOptions.message = 'password and confirm password not match';
    }
    registerDecorator({
      name: 'IsComparePassword',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return args.object[property] === value;
        },
      },
    });
  };
}
