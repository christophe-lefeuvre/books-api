import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './books/entities/books.entity';
import { AuthorsModule } from './authors/authors.module';
import { Author } from './authors/entities/author.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').default('dev'),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required().default(5432),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: +configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [Book, Author],
        synchronize: true,
      }),
    }),
    AuthorsModule,
    BooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}