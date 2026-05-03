import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CWD = process.cwd();

// 1. Re-add @repo/services to packages/lib/package.json
const libPkgPath = path.join(CWD, 'packages/lib/package.json');
let libPkg = JSON.parse(fs.readFileSync(libPkgPath, 'utf-8'));
libPkg.dependencies = libPkg.dependencies || {};
libPkg.dependencies['@repo/services'] = "workspace:*";
fs.writeFileSync(libPkgPath, JSON.stringify(libPkg, null, 2) + '\n');

// 2. Remove @repo/lib from packages/services/package.json
const srvPkgPath = path.join(CWD, 'packages/services/package.json');
let srvPkg = JSON.parse(fs.readFileSync(srvPkgPath, 'utf-8'));
if (srvPkg.dependencies && srvPkg.dependencies['@repo/lib']) {
  delete srvPkg.dependencies['@repo/lib'];
  fs.writeFileSync(srvPkgPath, JSON.stringify(srvPkg, null, 2) + '\n');
}

// 3. Redefine API_URL in api.functions.ts
const apiFnPath = path.join(CWD, 'packages/services/src/api.functions.ts');
let apiFnContent = fs.readFileSync(apiFnPath, 'utf-8');
apiFnContent = apiFnContent.replace(
  'import { API_URL } from "@repo/lib/config";',
  'const API_URL = typeof window !== "undefined" ? "/api" : process.env.API_URL || "http://localhost:3001/api";'
);
fs.writeFileSync(apiFnPath, apiFnContent);

// 4. Move queryOptions.ts BACK to packages/lib/src/
if (fs.existsSync(path.join(CWD, 'packages/services/src/queryOptions.ts'))) {
  execSync('mv packages/services/src/queryOptions.ts packages/lib/src/queryOptions.ts');
}

// 5. Restore queryOptions imports
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
  const filePath = path.join(CWD, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/@repo\/services\/queryOptions/g, '@repo/lib/queryOptions');
    fs.writeFileSync(filePath, content);
  }
}

// 6. Fix internal import in queryOptions.ts
const qoPath = path.join(CWD, 'packages/lib/src/queryOptions.ts');
let qoContent = fs.readFileSync(qoPath, 'utf-8');
qoContent = qoContent.replace('} from "./api.functions";', '} from "@repo/services/api.functions";');
fs.writeFileSync(qoPath, qoContent);

