import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './common/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // ECS sends SIGTERM, then SIGKILL after stopTimeout (30s default). This lets
  // Nest close the server and the Mongo connection inside that window, so a
  // deploy does not cut off in-flight requests.
  app.enableShutdownHooks();

  // 0.0.0.0, not localhost: inside a container 127.0.0.1 is the container
  // itself, so a loopback bind is unreachable from the host or a load balancer.
  await app.listen(configService.getPort(), '0.0.0.0');
}
bootstrap();
