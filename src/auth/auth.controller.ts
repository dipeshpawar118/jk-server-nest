import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    return { message: 'Redirecting to Google' };
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleCallback(@Req() req, @Res() res) {
    let { user, token } = req.user;
    res.send(`
      <script>
          window.opener.postMessage(
              ${JSON.stringify({ user, token })},
              "http://localhost:3000"
          );
          window.close();
      </script>
  `);
  }

  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  facebookLogin() {
    return { message: 'Redirecting to Facebook' };
  }

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  facebookCallback(@Req() req, @Res() res) {
    let { user, token } = req.user;
    res.send(`
      <script>
          window.opener.postMessage(
              ${JSON.stringify({ user, token })},
              "http://localhost:3000"
          );
          window.close();
      </script>
  `);
  }

  // Development-only endpoint to generate a token
  @Post('generate-token')
  async generateToken(@Body() body: { name: string; email: string }) {
    // if (process.env.NODE_ENV !== 'development') {
    //   return { message: 'This endpoint is only available in development mode' };
    // }

    const payload = { name: body.name, email: body.email };
    const token = await this.authService.generateTestJwt(payload);
    return { token };
  }
}
