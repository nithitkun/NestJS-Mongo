import { Injectable, BadRequestException } from '@nestjs/common';
import { IProfile, IAccount } from 'interfaces/app.interface';
import { IMemberDocument } from 'interfaces/member.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MemberService {
    constructor(
        @InjectModel('Member') private MemberCollection: Model<IMemberDocument>,
    ) { }
    async onUpdateProfile(memberID: any, body: IProfile) {
        const updated = await this.MemberCollection.update({ _id: memberID }, {
            firstname: body.firstname,
            lastname: body.lastname,
            position: body.position,
            image: body.image,
            updated: new Date(),
        } as IAccount);
        if (!updated.ok) throw new BadRequestException('ข้อมูลไม่ถูกเปลี่ยนแปลง')ว
        const memberItem = await this.MemberCollection.findById(memberID);
        memberItem.password = '';
        return memberItem;
    }
}
