import appConfig from './app.config';
import databaseConfig from './database.config';
import authConfig from './auth.config';
import mailConfig from './mail.config';
import siteFilesConfig from './site-files.config';

export const configLoaders = [appConfig, databaseConfig, authConfig, mailConfig, siteFilesConfig];
export { envValidationSchema } from './env.validation';
export { getDatabaseOptionsFromEnv } from './database.config';
