import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ApiKeyGuard } from 'src/guards/api-key.guard';

@UseGuards(ApiKeyGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    if (!dto) {
      throw new BadRequestException(
        'Request body {name, email, password} is missing.',
      );
    }
    return this.authService.signup({ dto });
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    if (!dto) {
      throw new BadRequestException(
        'Request body {email, password} is missing.',
      );
    }
    return this.authService.login({ dto });
  }
}
