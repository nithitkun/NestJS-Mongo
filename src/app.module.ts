import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { memberSchema } from './schemas/member.schema';
import { AccountController } from './controllers/account.controller';
import { DBAuthenService, DBAuthenStrategy } from './services/db-authen.service';
import { accessTokenSchema } from './schemas/access-token.schema';
import { JwtAuthenService, JwtAuthenStrategy } from './services/jwt-authen.service';
import { MemberController } from './controllers/member.controller';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/member_db'),
        MongooseModule.forFeature([
            { name: 'Member', schema: memberSchema },
            { name: 'AccessToken', schema: accessTokenSchema },
        ])
    ],
    controllers: [
        AppController,
        AccountController,
        MemberController
    ],
    providers: [
        AppService,
        DBAuthenService,
        DBAuthenStrategy,
        JwtAuthenService,
        JwtAuthenStrategy,
    ]
})
export class AppModule { }
