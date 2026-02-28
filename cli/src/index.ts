#!/usr/bin/env node

import { Command } from 'commander';
import { loginCommand } from './commands/login';
import { installCommand } from './commands/install';
import { listCommand } from './commands/list';
import { removeCommand } from './commands/remove';

const program = new Command();

program
  .name('helm-market')
  .description('Install and manage Helm Market skills')
  .version('1.0.0');

program
  .command('login')
  .description('Login with your install token')
  .action(loginCommand);

program
  .command('install <skill-slug>')
  .description('Install a skill from the marketplace')
  .action(installCommand);

program
  .command('list')
  .description('List installed skills')
  .action(listCommand);

program
  .command('remove <skill-slug>')
  .description('Remove an installed skill')
  .action(removeCommand);

program.parse(process.argv);
