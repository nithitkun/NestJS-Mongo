import { MongooseModule } from '@nestjs/mongoose';
import { DBAuthenService } from './services/db-authen.service';
import { CatSchema } from './schemas/cat.schema';
import { AppService } from 'services/app.service';
import { AppController } from 'controllers/app.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Cat', schema: CatSchema }]),
    MongooseModule.forRoot('mongodb://localhost/member_db'),
  ],
  controllers: [AppController],
  providers: [AppService, DBAuthenService],
})
export class CatsModule {}
