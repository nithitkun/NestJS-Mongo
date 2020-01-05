import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel('Member') private memberTable: Model<any>) {}

  async getItems() {
    return await this.memberTable.find();
  }

  createItem() {
    this.memberTable.create({
        firstname: 'firstname',
        lastname: 'lastname',
        email: 'email@example.',
        password: 'password',
        id: 1,
        position: 'posted',
        image: 'image',
        role: 2,
    });
  }
}
