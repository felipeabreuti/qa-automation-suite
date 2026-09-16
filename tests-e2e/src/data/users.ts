export type Credentials = {
  username: string;
  password: string;
};

export const standardUser: Credentials = {
  username: 'standard_user',
  password: 'secret_sauce',
};

export const lockedOutUser: Credentials = {
  username: 'locked_out_user',
  password: 'secret_sauce',
};

export const invalidPassword = 'senha_invalida';
