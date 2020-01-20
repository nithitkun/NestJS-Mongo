import { Injectable, UnauthorizedException } from '@nestjs/common';
import { generate } from 'password-hash';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAccessTokenDocument } from '../interfaces/access-token.interface';
import { IMemberDocument } from '../interfaces/member.interface';
import { IAuthen } from '../interfaces/authen.interface';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';

@Injectable()
export class DBAuthenService implements IAuthen {
    constructor(@InjectModel('AccessToken') private AccessTokenCollection: Model<IAccessTokenDocument>) { }

    // สร้าง Token
    async generateAccessToken(member: IMemberDocument) {
        const model = {
            memberID: member._id,
            accessToken: generate(Math.random().toString()),
            expire: new Date().setMinutes(new Date().getMinutes() + 30)
        };
        const token = await this.AccessTokenCollection.create(model);
        return token.accessToken;
    }

    // ยืนยันผู้ใช้ที่เข้าสู่ระบบ
    async validateUser(accessToken: any): Promise<IMemberDocument> {
        try {
            const tokenItem = await this.AccessTokenCollection.findOne({ accessToken }).populate('memberID');
            if (tokenItem.expire > new Date()) {
                return tokenItem.memberID;
            }
        }
        catch (ex) { }
        return null;
    }

}

@Injectable()
export class DBAuthenStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: DBAuthenService) {
        super();
    }

    async validate(token: any, done: Function) {
        const user = await this.authService.validateUser(token);
        if (!user) {
            return done(new UnauthorizedException('Unauthorized please login!'), false);
        }
        done(null, user);
    }
}