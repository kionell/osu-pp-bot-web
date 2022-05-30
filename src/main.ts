import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

(async function () {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT as string;

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.listen(port, () => {
    console.log(`Server is running on ${port}`);
  });
})();
