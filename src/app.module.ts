import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CatSchema } from 'schemas/cat.schema';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/member_db'),
        MongooseModule.forFeature([
            { name: 'Cat', schema: CatSchema },
        ]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
