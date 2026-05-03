import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const files = [
  'apps/landing/src/routes/__root.tsx',
  'apps/landing/src/routes/register.tsx',
  'apps/landing/src/routes/petunjuk.lazy.tsx',
  'apps/landing/src/routes/$pgcode.tsx',
  'apps/super-admin/src/routes/signup.tsx',
  'apps/super-admin/src/routes/signin.tsx',
  'apps/admin-pgbo/src/routes/settings.tsx',
  'apps/admin-pgbo/src/routes/settings.lazy.tsx',
  'apps/admin-pgbo/src/routes/overview.tsx',
  'apps/admin-pgbo/src/routes/signup.tsx',
  'apps/admin-pgbo/src/routes/signin.tsx',
  'packages/ui/src/auth/SignInForm.tsx',
  'packages/ui/src/auth/SignUpForm.tsx',
  'packages/ui/src/cta.tsx',
  'packages/ui/src/payment_methods.tsx'
];

for (const file of files) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/@repo\/lib\/queryOptions/g, '@repo/services/queryOptions');
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
}

// Revert packages/lib/package.json
const libPkgPath = path.join(process.cwd(), 'packages/lib/package.json');
let libPkg = JSON.parse(fs.readFileSync(libPkgPath, 'utf-8'));
if (libPkg.dependencies && libPkg.dependencies['@repo/services']) {
  delete libPkg.dependencies['@repo/services'];
  fs.writeFileSync(libPkgPath, JSON.stringify(libPkg, null, 2) + '\n');
  console.log('Reverted packages/lib/package.json');
}

// Move file
execSync('mv packages/lib/src/queryOptions.ts packages/services/src/queryOptions.ts');
console.log('Moved queryOptions.ts to packages/services/src');

