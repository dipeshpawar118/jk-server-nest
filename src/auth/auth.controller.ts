import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';

@Controller('auth')
export class AuthController {
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
}
