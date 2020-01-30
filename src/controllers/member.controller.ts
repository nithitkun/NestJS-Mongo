import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Body,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ProfileModel } from '../models/profile.model';
import { ValidationPipe } from '../pipes/validation.pipe';
import { RoleGuard } from '../guards/role.guard';
import { RoleAccount } from '../interfaces/app.interface';
import { MemberService } from '../services/member.services';
import { IMemberDocument } from '../interfaces/member.interface';
import { ChangePasswordModel } from '../models/password.model';
import { SearchModel } from '../models/search.model';
import { CreateMemberModel, ParamMembership, UpdateMemberModel } from '../models/member.model';

@Controller('api/member')
@UseGuards(AuthGuard('jwt'))
export class MemberController {
  constructor(private service: MemberService) {}

  @Get('data')
  getUserLogin(@Req() req: Request) {
    const userLogin: IMemberDocument = req.user as any;
    //   userLogin.image = userLogin.image ? 'http://localhost:3000' + userLogin.image : '';
    userLogin.password = '';
    return userLogin;
  }

  @Post('profile')
  updateProfile(
    @Req() req: Request,
    @Body(new ValidationPipe())
    body: ProfileModel,
  ) {
    return this.service.onUpdateProfile(req.user.id, body);
  }

  @Post('change-password')
  changePassword(
    @Req() req: Request,
    @Body(new ValidationPipe())
    body: ChangePasswordModel,
  ) {
    return this.service.onChangePassword(req.user.id, body);
  }

  @Get() // แสดงข้อมูลสมาชิก
  @UseGuards(new RoleGuard(RoleAccount.Admin, RoleAccount.Employee))
  showMember(
    @Query(new ValidationPipe())
    query: SearchModel,
  ) {
    query.startPage = parseInt(query.startPage as any);
    query.limitPage = parseInt(query.limitPage as any);
    return this.service.getMemberItems(query);
  }

  @Post('member')
  createMember(
    @Body(new ValidationPipe())
    body: CreateMemberModel,
  ) {
      return this.service.createMemberItem(body);
  }

  @Get(':id')
  @UseGuards(new RoleGuard(RoleAccount.Admin))
  showMemberById(@Param(new ValidationPipe()) param: ParamMembership){
    return this.service.getMemberItem(param.id);
  }

  @Put(':id')
  @UseGuards(new RoleGuard(RoleAccount.Admin))
  updateMemberById(@Param(new ValidationPipe()) param: ParamMembership, @Body(new ValidationPipe()) body: UpdateMemberModel){
    return this.service.updateMemberItem(param.id, body);
  }

  @Delete(':id')
  @UseGuards(new RoleGuard(RoleAccount.Admin, RoleAccount.Employee))
  delete(@Param(new ValidationPipe()) param: ParamMembership){
    return this.service.deleteMemberItem(param.id);
  }

}
