import { getMyInstalls } from '../lib/api';
import chalk from 'chalk';
import ora from 'ora';

export async function listCommand() {
  const spinner = ora('Fetching your installs...').start();
  
  try {
    const installs = await getMyInstalls();
    spinner.stop();

    if (installs.length === 0) {
      console.log(chalk.yellow('No skills installed yet.'));
      return;
    }

    console.log(chalk.bold('Skill'.padEnd(30) + 'Version'.padEnd(10) + 'Installed'));
    installs.forEach((inst: any) => {
      const date = new Date(inst.installedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      console.log(inst.slug.padEnd(30) + inst.version.padEnd(10) + date);
    });
  } catch (err: any) {
    spinner.fail(chalk.red(`✗ Failed to fetch installs: ${err.message}`));
  }
}
