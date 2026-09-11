import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    UsersModule,

    JwtModule.registerAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: Number(
            configService.get<string>('JWT_EXPIRES_IN_SECONDS') ?? '3600',
          ),
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, JwtAuthGuard],

  exports: [ JwtAuthGuard, JwtModule ],
})
export class AuthModule {}