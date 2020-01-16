import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { memberSchema } from 'schemas/member.schema';
import { AccountController } from 'controllers/account.controller';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/member_db'),
        MongooseModule.forFeature([
            { name: 'Member', schema: memberSchema},
        ]),
    ],
    controllers: [AppController, AccountController],
    providers: [AppService],
})
export class AppModule { }
