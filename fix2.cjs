const fs = require('fs');

function addReact(file) {
  let c = fs.readFileSync(file, 'utf8');
  if (!c.includes("import React ")) {
    fs.writeFileSync(file, "import React from 'react';\n" + c, 'utf8');
  }
}
addReact('src/components/ui/index.tsx');
addReact('src/layouts/MainLayout.tsx');
addReact('src/main.tsx');

function removeLine(file, regex) {
  let c = fs.readFileSync(file, 'utf8');
  let newC = c.replace(regex, '');
  if (c !== newC) fs.writeFileSync(file, newC, 'utf8');
}

removeLine('src/pages/admin/AdminTasksPage.tsx', /^\s*const navigate = useNavigate\(\);\r?\n/m);
removeLine('src/pages/auth/LoginPage.tsx', /^import \{ Input \} from '..\/..\/components\/ui\/Input';\r?\n/m);
removeLine('src/pages/auth/LoginPage.tsx', /^import \{ Button \} from '..\/..\/components\/ui\/Button';\r?\n/m);
removeLine('src/services/services.ts', /^import type \{ User \} from '\.\.\/types';\r?\n/m);

console.log('Fixed additional files');
