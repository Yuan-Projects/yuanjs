import fs from 'fs';

const content1 = `{
  "type": "commonjs"
}
`;

const content2 = `{
  "type": "module"
}
`;

try {
  fs.writeFileSync('./build/cjs/package.json', content1);
  // file written successfully
} catch (err) {
  console.error(err);
}

try {
  fs.writeFileSync('./build/mjs/package.json', content2);
  // file written successfully
} catch (err) {
  console.error(err);
}
