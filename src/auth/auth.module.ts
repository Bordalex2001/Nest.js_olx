import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthController } from '../auth/auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Token } from 'src/auth/models/token.model';

//Зробити аутентифікацію користувача, з БД працювати через ORM
//Реалізувати в моделях зв'язки між таблицями
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([User, Token]),
    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            return {
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string | number>('JWT_EXPIRES_IN')
                }
            }
        }
    }),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
})
export class AuthModule {}
