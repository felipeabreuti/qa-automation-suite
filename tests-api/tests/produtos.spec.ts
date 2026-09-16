import { test, expect } from '../src/fixtures/api.fixture';
import { buildUser, buildProduct } from '../src/data/factories';

test.describe('Produtos API', () => {
  test('GET /produtos retorna lista pública', async ({ request }) => {
    const response = await request.get('/produtos');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.produtos).toEqual(expect.any(Array));
    expect(body.quantidade).toBe(body.produtos.length);
  });

  test('POST /produtos sem token retorna 401', async ({ request }) => {
    const response = await request.post('/produtos', {
      data: buildProduct(),
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.message).toMatch(/token ausente|inválido|expirado/i);
  });

  test('POST /produtos com token de usuário não admin retorna 403', async ({ request }) => {
    const user = buildUser({ administrador: 'false' });
    const createUserResponse = await request.post('/usuarios', { data: user });
    expect(createUserResponse.status()).toBe(201);

    const loginResponse = await request.post('/login', {
      data: {
        email: user.email,
        password: user.password,
      },
    });
    expect(loginResponse.status()).toBe(200);

    const auth = (await loginResponse.json()).authorization;
    const response = await request.post('/produtos', {
      data: buildProduct(),
      headers: {
        Authorization: auth,
      },
    });

    expect(response.status()).toBe(403);

    const body = await response.json();
    expect(body).toEqual({ message: 'Rota exclusiva para administradores' });
  });

  test('POST /produtos com token admin cria produto', async ({ request, adminToken }) => {
    const produto = buildProduct();

    const response = await request.post('/produtos', {
      data: produto,
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toEqual({
      message: 'Cadastro realizado com sucesso',
      _id: expect.stringMatching(/^[A-Za-z0-9]{16}$/),
    });

    const getResponse = await request.get(`/produtos/${body._id}`);
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toEqual({ ...produto, _id: body._id });
  });
});
