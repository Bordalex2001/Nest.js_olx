import { Controller, Post, Body, UsePipes, ValidationPipe, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPassDto } from './dto/reset-pass.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Post('/signup')
  signUp(@Body() registerDto: RegisterDto): Promise<any> {
    return this.userService.signUp(registerDto);
  }

  @UsePipes(new ValidationPipe())
  @Post('/signin')
  signIn(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.userService.signIn(loginDto);
  }

  @UsePipes(new ValidationPipe())
  @Post('/forgot-password')
  forgotPassword(@Body('email') email: string): Promise<any> {
    return this.userService.sendPasswordResetEmail(email);
  }

  @UsePipes(new ValidationPipe())
  @Post('/reset-password')
  resetPassword(@Body() resetPassDto: ResetPassDto): Promise<any> {
    return this.userService.resetPassword(resetPassDto);
  }

  /*@Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }*/
}
