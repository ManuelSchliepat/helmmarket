import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'helm.config.json');

export function updateHelmConfig(slug: string, version: string, isRemove: boolean = false) {
  let config: any = { skills: [] };
  
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {}
  }
  
  if (!config.skills) config.skills = [];

  const entry = `${slug}@${version}`;
  
  if (isRemove) {
    config.skills = config.skills.filter((s: string) => !s.startsWith(slug));
  } else {
    // Remove old versions of same skill if exist
    config.skills = config.skills.filter((s: string) => !s.startsWith(slug));
    config.skills.push(entry);
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}
