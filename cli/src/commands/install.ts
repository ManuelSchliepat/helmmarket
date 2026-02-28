import { getSkill } from '../lib/api';
import { updateHelmConfig } from '../lib/config';
import { execSync } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';

export async function installCommand(slug: string) {
  const spinner = ora(`Fetching details for ${slug}...`).start();

  try {
    const data = await getSkill(slug);
    if (!data.hasAccess) {
      spinner.fail(chalk.red(`✗ You don't have access to this skill.`));
      console.log(chalk.yellow(`  Purchase at: helmmarket.com/skills/${slug}`));
      return;
    }

    spinner.text = `Installing ${data.npmPackage}...`;
    execSync(`npm install ${data.npmPackage}@${data.version}`, { stdio: 'ignore' });
    
    updateHelmConfig(slug, data.version);
    
    spinner.succeed(chalk.green(`✓ ${data.npmPackage} v${data.version} installed`));
  } catch (err: any) {
    spinner.fail(chalk.red(`✗ Install failed: ${err.message}`));
  }
}
