import { test, expect } from '../src/fixtures/api.fixture';
import { buildUser } from '../src/data/factories';
import { seedUserCredentials, nonexistentUserId, updatedUserName } from '../src/data/users';

test.describe('Usuarios API', () => {
  test('GET /usuarios retorna lista', async ({ request }) => {
    const response = await request.get('/usuarios');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.usuarios).toEqual(expect.any(Array));
    expect(body.quantidade).toBe(body.usuarios.length);
  });

  test('GET /usuarios/:id com id inexistente retorna 400', async ({ request }) => {
    const response = await request.get(`/usuarios/${nonexistentUserId}`);

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ message: 'Usuário não encontrado' });
  });

  test('POST /usuarios cria usuário com sucesso', async ({ request }) => {
    const payload = buildUser({ administrador: 'true' });
    const response = await request.post('/usuarios', { data: payload });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toEqual({
      message: 'Cadastro realizado com sucesso',
      _id: expect.stringMatching(/^[A-Za-z0-9]{16}$/),
    });

    const getResponse = await request.get(`/usuarios/${body._id}`);
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toEqual({ ...payload, _id: body._id });
  });

  test('POST /usuarios com email duplicado retorna 400', async ({ request }) => {
    const payload = buildUser({ email: seedUserCredentials.email, administrador: 'true' });
    const response = await request.post('/usuarios', { data: payload });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ message: 'Este email já está sendo usado' });
  });

  test('PUT /usuarios/:id atualiza usuário', async ({ request }) => {
    const payload = buildUser({ administrador: 'true' });
    const createResponse = await request.post('/usuarios', { data: payload });
    expect(createResponse.status()).toBe(201);
    const created = await createResponse.json();

    const updatedPayload = { ...payload, nome: updatedUserName };
    const response = await request.put(`/usuarios/${created._id}`, { data: updatedPayload });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ message: 'Registro alterado com sucesso' });

    const getResponse = await request.get(`/usuarios/${created._id}`);
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toEqual({ ...updatedPayload, _id: created._id });
  });

  test('DELETE /usuarios/:id remove usuário', async ({ request }) => {
    const payload = buildUser({ administrador: 'true' });
    const createResponse = await request.post('/usuarios', { data: payload });
    expect(createResponse.status()).toBe(201);
    const created = await createResponse.json();

    const response = await request.delete(`/usuarios/${created._id}`);

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ message: 'Registro excluído com sucesso' });

    const getResponse = await request.get(`/usuarios/${created._id}`);
    expect(getResponse.status()).toBe(400);
    expect(await getResponse.json()).toEqual({ message: 'Usuário não encontrado' });
  });
});
