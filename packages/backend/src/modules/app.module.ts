import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';

import { Env } from '@constants/enums';
import { ErrorFilter } from '@filters/error.filter';
import { RoleGuard } from '@guards/role.guard';
import { TransformInterceptor } from '@interceptors/transform.interceptor';
import { AuthMiddleWare } from '@middlewares/auth';
import { helmet } from '@middlewares/helmet';
import { rateLimit } from '@middlewares/rateLimit';
import { AuthModule } from '@modules/auth.module';
import { CandidatesModule } from '@modules/candidates.module';
import { ChatModule } from '@modules/chat.module';
import { CommentsModule } from '@modules/comments.module';
import { RecruitmentsModule } from '@modules/recruitments.module';
import { UsersModule } from '@modules/users.module';
import { AppConfigService } from '@services/config.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().valid(Env.dev, Env.prod, Env.test).default(Env.dev),
                RESUME_TEMPORARY_PATH: Joi.string().default('/tmp/resumes'),
                RESUME_PERSISTENT_PATH: Joi.string().default('./data/resumes'),
                PORT: Joi.number().default(5000),
                POSTGRES_HOST: Joi.string().default('postgres'),
                POSTGRES_PORT: Joi.number().default(5432),
                POSTGRES_USER: Joi.string().required(),
                POSTGRES_PASSWORD: Joi.string().required(),
                POSTGRES_DB: Joi.string().required(),
                JWT_KEY: Joi.string().required(),
                APP_ID: Joi.string().required(),
                AGENT_ID: Joi.string().required(),
                REDIRECT_URI: Joi.string().required(),
                CORP_ID: Joi.string().required(),
                CORP_SECRET: Joi.string().required(),
            }),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (conf: ConfigService) => ({
                type: 'postgres',
                host: conf.get('POSTGRES_HOST'),
                port: conf.get('POSTGRES_PORT'),
                username: conf.get('POSTGRES_USER'),
                password: conf.get('POSTGRES_PASSWORD'),
                database: conf.get('POSTGRES_DB'),
                synchronize: true,
                autoLoadEntities: true,
                useUnifiedTopology: true,
            }),
        }),
        AuthModule,
        CandidatesModule,
        ChatModule,
        CommentsModule,
        RecruitmentsModule,
        UsersModule,
    ],
    providers: [
        AppConfigService,
        {
            provide: APP_GUARD,
            useClass: RoleGuard,
        },
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: ErrorFilter,
        },
    ],
})
export class AppModule implements NestModule {
    constructor(private readonly configService: AppConfigService) {
    }

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                rateLimit(60000, 2048),
                helmet({
                    contentSecurityPolicy: this.configService.isDev ? false : undefined,
                }),
                AuthMiddleWare,
            )
            .forRoutes('*');
    }
}
