import { setToken } from '../lib/auth';
import { validateToken } from '../lib/api';
import chalk from 'chalk';
import readline from 'readline';

export async function loginCommand() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter your install token: ', async (token) => {
    try {
      if (!token) throw new Error('Token is required');
      
      const res = await validateToken(token);
      if (res.valid) {
        setToken(token);
        console.log(chalk.green(`✓ Logged in as ${res.username || 'user'}`));
      } else {
        console.log(chalk.red('✗ Invalid token'));
      }
    } catch (err: any) {
      console.log(chalk.red(`✗ ${err.message}`));
    } finally {
      rl.close();
    }
  });
}
