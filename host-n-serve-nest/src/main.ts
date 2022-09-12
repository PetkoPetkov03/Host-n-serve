import { NestFactory } from '@nestjs/core';
import * as bodyParser from "body-parser";
import { AppModule } from './app.module';
import { config } from 'dotenv';
import mongoose from 'mongoose';
config();

async function bootstrap() {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  if(conn){
    const app = await NestFactory.create(AppModule, { cors: true } );

    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    await app.listen(process.env.PORT);
  }else{
    throw new Error("Unable to connect to database");
  };
}
bootstrap();
