import { name, version, repository } from '../../package.json';
import config from '../config/config';

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: `${name} API documentation`,
    version: '1.0.0',
    license: {
      name: 'MIT',
      url: repository
    }
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`
    }
  ],
  paths: {
    path: {
      '/auth/login': [Object]
    }
  }
};

export default swaggerDef;
