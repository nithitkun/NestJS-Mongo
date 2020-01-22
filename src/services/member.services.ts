import { Injectable, BadRequestException } from '@nestjs/common';
import { IProfile } from 'interfaces/app.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMemberDocument } from '../interfaces/member.interface';
import { IAccount } from '../interfaces/app.interface';
import { BASE_DIR } from '../main';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

@Injectable()
export class MemberService {
    constructor(@InjectModel('Member') private MemberCollection: Model<IMemberDocument>) { }

    // แก้ไขข้อมูลโปรไฟล์
    async onUpdateProfile(memberID: any, body: IProfile) {
        const updated = await this.MemberCollection.update({ _id: memberID },  {
            firstname: body.firstname,
            lastname: body.lastname,
            position: body.position,
            // image: this.convertUploadImage(memberID, body.image),
            image: body.image,
            updated: new Date(),
        } as IAccount);
        if (!updated.ok) throw new BadRequestException('ข้อมูลไม่มีการเปลี่ยนแปลง');
        const memberItem = await this.MemberCollection.findById(memberID);
        memberItem.password = '';
        // memberItem.image = memberItem.image ? 'http://localhost:3000' + memberItem.image + '?ver=' + Math.random() : '';
        return memberItem;
    }

    // แปลงรูปภาพจาก Base64 เป็นไฟล์
    private convertUploadImage(memberID, image: string) {
        try {
            // สร้างโฟลเดอร์ใหม่
            const uploadDir = BASE_DIR + '/uploads';
            if (!existsSync(uploadDir)) mkdirSync(uploadDir);

            // ตรวจสอบว่าเป็นชนิด .jpg
            if (image.indexOf('image/jpeg') >= 0) {
                const fileName = `${uploadDir}/${memberID}.jpg`;
                writeFileSync(fileName, new Buffer(image.replace('data:image/jpeg;base64,', ''), 'base64'));
                return fileName.replace(BASE_DIR, '');
            }
            return '';
        }
        catch (ex) {
            throw new BadRequestException(ex.message);
        }
    }

}