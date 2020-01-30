import { IAccount, RoleAccount } from 'interfaces/app.interface';
import {
  IsNotEmpty,
  IsEmail,
  Matches,
  IsMongoId,
  ValidateIf,
} from 'class-validator';
import { IsRoleAccount } from 'pipes/validation.pipe';

export class CreateMemberModel implements IAccount {
  @IsNotEmpty() firstname: string;
  @IsNotEmpty() lastname: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @Matches(/^[A-z0-9]{6,15}$/)
  password: string;
  @IsNotEmpty() position?: string;
  image?: string;
  @IsNotEmpty()
  @Matches(
    new RegExp(
      `(${RoleAccount.Admin}|${RoleAccount.Employee}${RoleAccount.Member}){1}`,
    ),
  )
  @IsNotEmpty()
  @IsRoleAccount()
  role?: RoleAccount;

  id?: any;
  created?: Date;
  updated?: Date;
}

export class UpdateMemberModel implements IAccount {
  @IsNotEmpty() firstname: string;
  @IsNotEmpty() lastname: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ValidateIf((m: UpdateMemberModel) => m.password && m.password.trim() !== '')
  @Matches(/^[A-z0-9]{6,15}$/)
  password: string;
  @IsNotEmpty() position?: string;
  image?: string;

  @IsNotEmpty()
  @IsRoleAccount()
  role?: RoleAccount;

  id?: any;
  created?: Date;
  updated?: Date;
}

export class ParamMembership {
  @IsMongoId() id: number;
}
