import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CustomLogger } from '../logger/logger.service';

@Injectable()
export class UsersService {
  private readonly logger = new CustomLogger();

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOrCreate(profile: any): Promise<User> {
    this.logger.log(
      `Finding or creating user with email: ${profile.emails[0].value}`,
    );
    const email = profile.emails[0].value;
    let user = await this.userModel.findOne({ email });
    if (!user) {
      user = new this.userModel({ name: profile.displayName, email });
      await user.save();
    }
    return user;
  }
}
