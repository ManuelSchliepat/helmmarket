import { updateHelmConfig } from '../lib/config';
import { execSync } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';

export async function removeCommand(slug: string) {
  const spinner = ora(`Removing ${slug}...`).start();

  try {
    // Assuming npm package name is same as slug or standard format
    // Real implementation might need to fetch registry endpoint
    const npmPackage = `@helm-market/${slug.replace('@helm-market/', '')}`;
    
    execSync(`npm uninstall ${npmPackage}`, { stdio: 'ignore' });
    updateHelmConfig(slug, '', true);
    
    spinner.succeed(chalk.green(`✓ ${npmPackage} removed`));
  } catch (err: any) {
    spinner.fail(chalk.red(`✗ Remove failed: ${err.message}`));
  }
}
