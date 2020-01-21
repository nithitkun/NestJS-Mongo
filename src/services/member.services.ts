import { Injectable, BadRequestException } from '@nestjs/common';
import { IProfile, IAccount } from 'interfaces/app.interface';
import { IMemberDocument } from 'interfaces/member.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BASE_DIR } from 'main';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

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
            image: this.convertUploadImage(memberID, body.image),
            updated: new Date(),
        } as IAccount);
        if (!updated.ok) throw new BadRequestException('ข้อมูลไม่ถูกเปลี่ยนแปลง')ว
        const memberItem = await this.MemberCollection.findById(memberID);
        memberItem.password = '';
        memberItem.image = memberItem.image ? 'https://localhost:3000' + memberItem.image + '?ver=' + Math.random() : '';
        return memberItem;
    }

    private convertUploadImage(memberID, image: string) {
        try {
            const uploadDir = BASE_DIR + '/uploads';
            if (!existsSync(uploadDir)) mkdirSync(uploadDir);
            if (image.indexOf('image/jpeg') >= 0) {
                const filename = `${uploadDir}/${memberID}.jpg`;
                writeFileSync(filename, new Buffer(image.replace('data:image/jpeg;base64', ''), 'base64'));
                return filename.replace(BASE_DIR, '');
            }
            return '';
        } catch (err) {
            throw new BadRequestException(err.message);
        }

    }
}
