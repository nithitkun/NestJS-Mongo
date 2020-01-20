import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IMemberDocument } from 'interfaces/member.interface';

@Controller('api/member')
@UseGuards(AuthGuard('jwt'))
export class MemberController {

    @Get('data')
    getUserLogin(@Req() req: Request) {
        const userLogin: IMemberDocument = req.user as any;
        userLogin.password = '';
        return userLogin;
    }

}