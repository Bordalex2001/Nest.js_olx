import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as nodemailer from 'nodemailer';
import { ResetPassDto } from './dto/reset-pass.dto';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly jwtService: JwtService
  ) {}
  
  async signUp(registerDto: RegisterDto): Promise<any> {
    const { email, password, first_name, last_name, phone_number, about_user, role } = registerDto;
    
    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      this.logger.error(`Email conflict: ${email}`);
      throw new ConflictException('User with this email already exists');
    }
    
    const password_hash = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({ 
      first_name,
      last_name,
      email, 
      password: password_hash,
      role: role || 'guest',
      phone_number,
      about_user
    });

    this.logger.log(`User registered with email: ${email}`);
    return { message: 'User registered successfully', userId: user.id };
  }

  async signIn(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ where: { email }});
    if (!user || !(await bcrypt.compare(password, user.password))) {
      this.logger.error(`Invalid credentials for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      id: user.id, 
      first_name: user.first_name, 
      last_name: user.last_name, 
      role: user.role 
    };
    
    const access_token = this.jwtService.sign(payload);

    this.logger.log(`User authorized with email: ${email}`);
    return { access_token };
  }

  async sendPasswordResetEmail(email: string): Promise<any> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    const reset_token = crypto.randomBytes(20).toString("hex");
    const reset_token_expires = new Date(Date.now() + 3600 * 1000);

    await this.userModel.update(
      { reset_token, reset_token_expires },
      { where: { email: user.email } }
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Token to reset your password is: <b>${reset_token}</b></p>`
    });

    this.logger.log(`Password reset email sent to: ${email}`);
    return { message: 'Password reset email sent' };
  }

  async resetPassword(resetPassDto: ResetPassDto): Promise<any> {
    const { reset_token, new_password } = resetPassDto;

    const user = await this.userModel.findOne({ where: { reset_token } });
    if (reset_token !== user.reset_token || Date.now() > user.reset_token_expires.getTime()) {
      throw new BadRequestException('Invalid or expired token');
    }

    const password_hash = await bcrypt.hash(new_password, 10);
    await this.userModel.update(
      { password: password_hash, reset_token: null, reset_token_expires: null },
      { where: { reset_token } }
    );

    this.logger.log(`Password reset for user: ${user.email}`);
    return { message: 'Password reset successfully' };
  }

  async findAll() {
    return await this.userModel.findAll();
  }

  async findOne(id: string) {
    return await this.userModel.findByPk(id);
  }

  async update(id: string, updateUserDto) {
    const rows = await this.userModel.update(updateUserDto, {
      where: { id }
    });
    this.logger.log(`Update row ${rows}`);
    if(rows[0]){
      return { id, ...updateUserDto };
    }
    return `User #${id} not found`;
  }

  async remove(id: string) {
    const rows = await this.userModel.destroy
    ({
      where: { id }
    });
    this.logger.log(`Delete row ${rows}`);
    if(rows[0]){
      return `User #${id} has been removed`;
    }
    return `User #${id} not found`;
  }
}
