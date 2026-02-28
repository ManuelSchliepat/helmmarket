import Conf from 'conf';

const config = new Conf({ projectName: 'helm-market-cli' });

export function setToken(token: string) {
  config.set('installToken', token);
}

export function getToken(): string | null {
  return config.get('installToken') as string | null;
}

export function logout() {
  config.delete('installToken');
}
