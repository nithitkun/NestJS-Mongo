import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMemberDocument } from 'interfaces/member.interface';
import { IRegister, IAccount, RoleAccount } from 'interfaces/app.interface';
import { generate } from 'password-hash';
@Injectable()
export class AppService {
  constructor(
    @InjectModel('Member') private MemberCollection: Model<IMemberDocument>,
  ) {}

  async onRegister(body: IRegister) {
    const count = await this.MemberCollection.count({email: body.email});
    if (count > 0) throw new BadRequestException('มี email ในระบบแล้ว');
    delete body.cpassword;
    const model: IAccount = body;
    model.password = generate(model.password);
    model.image = '';
    model.position = '';
    model.role = RoleAccount.Member;
    const modelItem = await this.MemberCollection.create(model);
    modelItem.password = '';
    return modelItem;
  }
}
