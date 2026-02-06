import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet, { HelmetOptions } from 'helmet';
import morgan from 'morgan';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const nodeEnv = config.get<string>('app.nodeEnv', 'development');
  const isProduction = nodeEnv === 'production';

  const helmetOptions: HelmetOptions = {
    contentSecurityPolicy: isProduction,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  };
  app.use(helmet(helmetOptions));
  app.use(compression());

  const cookieSecret = config.get<string>('app.cookieSecret');
  app.use(cookieParser(cookieSecret));

  const morganFormat = isProduction ? 'combined' : 'dev';
  app.use(morgan(morganFormat));

  const corsOrigin = config.get<string>('app.corsOrigin');
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  const validationPipeOptions = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: false,
    transformOptions: {
      enableImplicitConversion: true,
    },
  });
  app.useGlobalPipes(validationPipeOptions);

  const allExceptionsFilter = new AllExceptionsFilter();
  app.useGlobalFilters(allExceptionsFilter);

  const apiPrefix = config.get<string>('app.apiPrefix', 'api');
  app.setGlobalPrefix(apiPrefix);

  const port = config.get<number>('app.port', 3001);
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
