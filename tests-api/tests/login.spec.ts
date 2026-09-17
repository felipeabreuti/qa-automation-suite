import { test, expect } from '../src/fixtures/api.fixture';
import { seedUserCredentials, invalidPassword } from '../src/data/users';

test.describe('Login API', () => {
  test('login com credenciais válidas retorna 200 e token', async ({ request }) => {
    const response = await request.post('/login', {
      data: seedUserCredentials,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toEqual({
      message: 'Login realizado com sucesso',
      authorization: expect.stringMatching(/^Bearer [\w-]+\.[\w-]+\.[\w-]+$/),
    });
  });

  test('login com senha inválida retorna 401', async ({ request }) => {
    const response = await request.post('/login', {
      data: { ...seedUserCredentials, password: invalidPassword },
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body).toEqual({ message: 'Email e/ou senha inválidos' });
    expect(body).not.toHaveProperty('authorization');
  });

  test('login com corpo incompleto retorna 400 de validação', async ({ request }) => {
    const response = await request.post('/login', {
      data: { email: seedUserCredentials.email },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toEqual({ password: 'password é obrigatório' });
  });
});
