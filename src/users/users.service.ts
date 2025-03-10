import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOrCreate(profile: any): Promise<User> {
    const email = profile.emails[0].value;
    let user = await this.userModel.findOne({ email });
    if (!user) {
      user = new this.userModel({ name: profile.displayName, email });
      await user.save();
    }
    return user;
  }
}
