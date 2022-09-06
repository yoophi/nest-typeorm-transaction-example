import { ConnectionOptions } from 'typeorm';

const isDevelopment = process.env.NODE_ENV !== 'prod';

const ormconfig: ConnectionOptions = {
  type: process.env.DB_ENGINE as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity{.js,.ts}'],
  // migrations: [__dirname + '/src/**/migrations/*{.js,.ts}'],
  // cli: { migrationsDir: 'src/**/migrations' },
  synchronize: true,
  logging: !isDevelopment ? false : 'all',
};

export default ormconfig;
