const fs = require('fs');
const replace = require('replace-in-file');
const { exec } = require('child_process');

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
    from: /{{package-name}}/g,
    to: packageName
  }).then(() => replace({
    files: process.cwd() + '/**',
    from: /{{owner}}/g,
    to: packageOrg
  }));

  fs.unlinkSync('README.md');
  fs.renameSync('README.template.md', 'README.md');

  fs.unlinkSync('init');

  return exec('npm un -D replace-in-file yargs');
} catch (e) {
  console.error(`Please, provide package information in the following format:
  node init {github-username-or-org}/{package-name}`);

  return 1;
}
