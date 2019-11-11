const fs = require('fs');
const replace = require('replace-in-file');

const yargs = require('yargs')
  .option('description', {
    alias: 'd',
    help: 'A short package description',
    default: ''
  })
  .argv;

try {
  const [packageOrg, packageName] = yargs._[0].split('/');

  replace({
    files: process.cwd() + '/**',
    from: /{{package-name}}/,
    to: packageName
  });

  replace({
    files: process.cwd() + '/**',
    from: /{{owner}}/,
    to: packageOrg
  });

  fs.unlinkSync('README.md');
  fs.renameSync('README.template.md', 'README.md');

  return 0;
} catch (e) {
  console.error(`Please, provide package information in the following format:
  node init {github-username-or-org}/{package-name}`);

  return 1;
}
