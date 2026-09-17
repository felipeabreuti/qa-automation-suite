import { test as base } from '@playwright/test';
import { buildUser } from '../data/factories';

type ApiFixture = {
  adminToken: string;
};

export const test = base.extend<ApiFixture>({
  adminToken: async ({ request }, use) => {
    const user = buildUser({ administrador: 'true' });

    const createResponse = await request.post('/usuarios', {
      data: user,
    });

    const createBody = await createResponse.json().catch(() => ({}));
    if (!createResponse.ok()) {
      throw new Error(`Falha ao registrar usuário admin: ${createResponse.status()} ${JSON.stringify(createBody)}`);
    }

    const loginResponse = await request.post('/login', {
      data: {
        email: user.email,
        password: user.password,
      },
    });

    const loginBody = await loginResponse.json().catch(() => ({}));
    if (!loginResponse.ok()) {
      throw new Error(`Falha ao autenticar usuário admin: ${loginResponse.status()} ${JSON.stringify(loginBody)}`);
    }

    const token = loginBody.authorization?.replace('Bearer ', '') ?? '';
    if (!token) {
      throw new Error(`Token ausente no login: ${JSON.stringify(loginBody)}`);
    }

    await use(token);
  },
});

export { expect } from '@playwright/test';
