import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { KeepAliveService } from './keep-alive.service';
import { ObjectsModule } from './objects/objects.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/heyama',
      }),
    }),
    ObjectsModule,
  ],
  controllers: [AppController],
  providers: [KeepAliveService],
})
export class AppModule {}
