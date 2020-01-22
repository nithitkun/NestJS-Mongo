import { Controller, Get, UseGuards, Req, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IMemberDocument } from 'interfaces/member.interface';
import { ProfileModel } from '../models/profile.model';
import { ValidationPipe } from '../pipes/validation.pipe';
import { MemberService } from 'services/member.services';

@Controller('api/member')
@UseGuards(AuthGuard('jwt'))
export class MemberController {
    constructor(private service: MemberService) { }

    @Get('data')
    getUserLogin(@Req() req: Request) {
        const userLogin: IMemberDocument = req.user as any;
        userLogin.image = userLogin.image ? 'http://localhost:3000' + userLogin.image : '';
        userLogin.password = '';
        return userLogin;
    }

    @Post('profile')
    updateProfile(@Req() req: Request, @Body(new ValidationPipe()) body: ProfileModel) {
        return this.service.onUpdateProfile(req.user.id, body);
    }

}