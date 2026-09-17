export type UserPayload = {
  nome: string;
  email: string;
  password: string;
  administrador: 'true' | 'false';
};

export type ProductPayload = {
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
};

const randomString = (length: number): string =>
  Math.random().toString(36).slice(2, 2 + length).padEnd(length, 'x');

export const generateUniqueEmail = (prefix = 'qa-user'): string =>
  `${prefix}.${randomString(8)}.${Date.now()}@mail.com`;

export const generateUniqueProductName = (prefix = 'Produto QA'): string =>
  `${prefix} ${randomString(8)}.${Date.now()}`;

export const buildUser = (overrides: Partial<UserPayload> = {}): UserPayload => ({
  nome: `QA User ${randomString(6)}`,
  email: generateUniqueEmail(),
  password: '123456',
  administrador: 'false',
  ...overrides,
});

export const buildProduct = (overrides: Partial<ProductPayload> = {}): ProductPayload => ({
  nome: generateUniqueProductName(),
  preco: 100,
  descricao: 'Produto gerado pela suíte de testes',
  quantidade: 1,
  ...overrides,
});
