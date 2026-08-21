import { createApp } from './app';
import { env } from './config/env.config';
import { connectDatabase } from './config/database.config';
import { logger } from './utils/logger';

const bootstrap = async (): Promise<void> => {
  await connectDatabase();

  const app = createApp();

  app.listen(env.PORT, () => {
    logger.info(`Gymosn backend listening on http://localhost:${env.PORT}`);
  });
};

bootstrap();
