import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatSchema } from './schemas/cat.schema';
import { AppService } from 'services/app.service';
import { AppController } from 'controllers/app.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Cat', schema: CatSchema }]),
    MongooseModule.forRoot('mongodb://localhost/member_db'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class CatsModule { }
