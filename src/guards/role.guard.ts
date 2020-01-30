import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RoleAccount, IAccount } from 'interfaces/app.interface';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  private roles: RoleAccount[];
  constructor(..._roles: RoleAccount[]) {
    this.roles = _roles;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as Request;

    if (request.user) {
      const userLogin = request.user as IAccount;
      const searchRoles = this.roles.filter(role => role === userLogin.role);
      return searchRoles.length > 0;
    }

    return false;
  }
}
