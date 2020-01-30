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
import { IMemberDocument } from 'interfaces/member.interface';
import { ProfileModel } from '../models/profile.model';
import { ValidationPipe } from '../pipes/validation.pipe';
import { MemberService } from 'services/member.services';
import { ChangePasswordModel } from 'models/password.model';
import { SearchModel } from 'models/search.model';
import { ParamMembership, UpdateMemberModel, CreateMemberModel } from 'models/member.model';

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
  showMembes(
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
  showMemberById(@Param(new ValidationPipe()) param: ParamMembership){
    return this.service.getMemberItem(param.id);
  }

  @Put(':id')
  updateMemberById(@Param(new ValidationPipe()) param: ParamMembership, @Body(new ValidationPipe()) body: UpdateMemberModel){
    return this.service.updateMemberItem(param.id, body);
  }

  @Delete(':id')
  delete(@Param(new ValidationPipe()) param: ParamMembership){
    return this.service.deleteMemberItem(param.id);
  }

}
