import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GoogleStrategy } from './google.strategy';
import { FacebookStrategy } from './facebook.strategy';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
      signOptions: { expiresIn: '10h' },
    }),
    ConfigModule.forRoot(),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    UsersService,
    GoogleStrategy,
    FacebookStrategy,
    JwtStrategy,
    AuthService,
  ],
})
export class AuthModule {}
