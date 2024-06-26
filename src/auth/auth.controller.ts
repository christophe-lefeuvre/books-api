import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }
}
