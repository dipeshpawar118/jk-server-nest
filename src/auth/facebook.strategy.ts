import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { Strategy } from 'passport-facebook';
import { AuthService } from './auth.service';

type VerifyCallback = (error: any, user?: any, info?: any) => void;

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('FACEBOOK_CLIENT_ID') || '',
      clientSecret: configService.get('FACEBOOK_CLIENT_SECRET') || '',
      callbackURL: configService.get('FACEBOOK_CALLBACK_URL') || '',
      profileFields: ['id', 'emails', 'displayName'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const user = await this.usersService.findOrCreate(profile);
    const token = await this.authService.validateOAuthLogin(user);
    return { user, token };
  }
}
