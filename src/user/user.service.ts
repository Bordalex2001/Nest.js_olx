import { BadRequestException, ConflictException, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as nodemailer from 'nodemailer';
import { ResetPassDto } from './dto/reset-pass.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    //const reset_token_expires = new Date(Date.now() + 3600 * 1000);

    /*await this.userModel.update(
      { reset_token, reset_token_expires },
      { where: { email: user.email } }
    );*/

    await this.cacheManager.set(`password-reset:${reset_token}`, user.email, 3600000);

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

    const email = await this.cacheManager.get(`password-reset:${reset_token}`);
    if (!email) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const password_hash = await bcrypt.hash(new_password, 10);

    await this.userModel.update(
      { password: password_hash },
      { where: { email } }
    );

    await this.cacheManager.del(`password-reset:${reset_token}`);

    this.logger.log(`Password reset for email: ${email}`);
    return { message: 'Password reset successfully' };
  }

  async findAll() {
    const cached_users = await this.cacheManager.get('users');
    if (cached_users) {
      this.logger.log('Fetching all users from cache');
      return cached_users as User[];
    }
    
    const users = await this.userModel.findAll();
    await this.cacheManager.set('users', users, 300000);
    this.logger.log('Fetching all users');
    return users;
  }

  async findOne(id: string){
    const cached_user = await this.cacheManager.get(`user:${id}`);
    if (cached_user) {
      this.logger.log(`Fetching user with id: ${id} from cache`);
      return cached_user as User;
    }

    const user = await this.userModel.findByPk(id);
    if (!user) {
      this.logger.error(`User not found: ${id}`);
      throw new NotFoundException('User not found');
    }
    
    await this.cacheManager.set(`user:${id}`, user, 300000);
    this.logger.log(`Fetching user with id: ${id}`);
    return user;
  }

  async removeFromCache(id: string) {
    await this.cacheManager.del(`user:${id}`);
    this.logger.log(`User with id: ${id} removed from cache`);
    return { message: 'User removed from cache' };
  }

  async update(id: string, updateUserDto) {
    const user = await this.findOne(id);

    await user.update(updateUserDto);
    this.logger.log(`Updating user with id: ${id}`);
    return { message: 'User updated successfully' };
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    await user.destroy();
    this.logger.log(`Deleting user with id: ${id}`);
    return { message: 'User deleted successfully' };
  }
}
