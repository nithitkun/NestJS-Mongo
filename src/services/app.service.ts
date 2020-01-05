import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel('Cat') private catTable: Model<any>) {}

  async getItems() {
    return await this.catTable.find();
  }

  createItem() {
    const model = new this.catTable({
      name: new Date().toString(),
      age: Math.random(),
      sex: 'Male',
    });
    model.save();
  }
}
