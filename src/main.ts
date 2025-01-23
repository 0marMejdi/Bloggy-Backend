import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import { log } from "console";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  dotenv.config();
  const config = new DocumentBuilder()
    .setTitle("ConsommiDotTN APIs")
    .setDescription("Endpoints for e-commerce site with some ML")
    .setVersion("1.0")
    .build();

  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    validationError: { target: false }
  }));
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
    }
    app.enableCors(corsOptions);
  await app.listen(PORT);
  log("App is runnning at: http://localhost:" + PORT);
}

bootstrap();
