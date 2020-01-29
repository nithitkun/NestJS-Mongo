import { Injectable, BadRequestException } from '@nestjs/common';
import {
  IProfile,
  IChangePassword,
  IMember,
  ISearch,
} from 'interfaces/app.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMemberDocument } from '../interfaces/member.interface';
import { IAccount } from '../interfaces/app.interface';
import { BASE_DIR } from '../main';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { verify, generate } from 'password-hash';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel('Member') private MemberCollection: Model<IMemberDocument>,
  ) {}

  // แก้ไขข้อมูลสมาชิก
  async updateMemberItem(memberID: any, body: IAccount) {
    const memberUpdate = await this.MemberCollection.findById(memberID);
    if (!memberUpdate) throw new BadRequestException('ไม่มีข้อมูลนี้ในระบบ');
    try {
      memberUpdate.firstname = body.firstname;
      memberUpdate.lastname = body.lastname;
      memberUpdate.image = body.image || '';
      memberUpdate.position = body.position;
      memberUpdate.email = body.email;
      memberUpdate.role = body.role;
      memberUpdate.updated = new Date();

      if (body.password && body.password.trim() !== '') {
        memberUpdate.password = generate(body.password);
      }

      const memberItemCount = await this.MemberCollection.count({
        email: body.email,
      });
      if (memberUpdate.email !== body.email && memberItemCount > 0)
        throw new BadRequestException('มีอีเมลล์นี้ในระบบแล้ว');
      const updated = await this.MemberCollection.update(
        { _id: memberID },
        memberUpdate,
      );
      if (updated.ok) {
        return await this.MemberCollection.findById(memberID);
      } else {
        throw new BadRequestException('ไม่สามารถแก้ไขข้อมูลได้');
      }
      return updated;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  // แสดงข้อมูลสมาชิกจาก ID
  async getMemberItem(memberID: any) {
    const memberItem = await this.MemberCollection.findById(memberID, {
      password: false,
    });
    return memberItem;
  }

  // เพิ่มข้อมูลสมาชิก
  async createMemberItem(body: IAccount) {
    const count = await this.MemberCollection.count({ email: body.email });
    if (count > 0) throw new BadRequestException('มีอีเมลล์นี้ในระบบแล้ว');
    body.image = body.image || '';
    body.password = generate(body.password);
    const createMember = await this.MemberCollection.create(body);
    createMember.password = '';
    return createMember;
  }

  // แสดงข้อมูลสมาชิก
  async getMemberItems(searchOptions: ISearch): Promise<IMember> {
    let queryItem = () => this.MemberCollection.find({}, { image: false });

    // ค้นหาข้อมูลสมาชิก
    if (searchOptions.searchText && searchOptions.searchType) {
      const text = searchOptions.searchText;
      const type = searchOptions.searchType;
      const condition = {};
      switch (type) {
        case 'role':
          condition[type] = text;
          queryItem = () =>
            this.MemberCollection.find(condition, { image: false });
          break;
        case 'updated':
          // queryItem = () =>
          //   this.MemberCollection.find({}, { image: false })
          //     .where('updated')
          //     .gt(text['from'])
          //     .lt(
          //       text['to'],
          //     );
          this.MemberCollection.find(
            {
              updated: {
                $gt: text['from'],
                $lt: text['to'],
              },
            },
            { image: false },
          );
          break;
        default:
          condition[type] = new RegExp(text, 'i');
          queryItem = () =>
            this.MemberCollection.find(condition, { image: false });
          break;
      }
    }

    // ค้นหาและแบ่งหน้า page
    const items = await queryItem()
      .sort({ updated: -1 })
      .skip((searchOptions.startPage - 1) * searchOptions.limitPage)
      .limit(searchOptions.limitPage);

    // หาผลรวมของหน้า page ทั้งหมด
    const totalItems = await queryItem().count({});

    return {
      items,
      totalItems,
    };
  }

  // แก้ไข password
  async onChangePassword(memberID: any, body: IChangePassword) {
    const memberItem = await this.MemberCollection.findById(memberID);
    if (!verify(body.old_pass, memberItem.password))
      throw new BadRequestException('รหัสผ่านเดิมไม่ถูกต้อง');
    const update = await this.MemberCollection.update({ _id: memberID }, {
      password: generate(body.new_pass),
      updated: new Date(),
    } as IAccount);
    memberItem.image = null;
    return update;
  }

  // แก้ไขข้อมูลโปรไฟล์
  async onUpdateProfile(memberID: any, body: IProfile) {
    const updated = await this.MemberCollection.update({ _id: memberID }, {
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
        writeFileSync(
          fileName,
          new Buffer(image.replace('data:image/jpeg;base64,', ''), 'base64'),
        );
        return fileName.replace(BASE_DIR, '');
      }
      return '';
    } catch (ex) {
      throw new BadRequestException(ex.message);
    }
  }
}
