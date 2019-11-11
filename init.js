const fs = require('fs');
const replace = require('replace-in-file');
const { exec } = require('child_process');

const yargs = require('yargs')
  .option('description', {
    alias: 'd',
    help: 'A short package description',
    default: ''
  })
  .option('dev', {
    alias: 'i',
    default: false
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
  })).then(() => process.exit(0));

  fs.unlinkSync('README.md');
  fs.renameSync('README.template.md', 'README.md');

  if (!yargs.dev) {
    exec('npm un -D replace-in-file yargs').on('exit', (code) => {
      process.exit(code);
    });

    fs.unlinkSync('init.js');
  }
} catch (e) {
  console.error(`Please, make sure you have provided the package information in the following format:
  node init {github-username-or-org}/{package-name}`);

  console.error(e);

  return process.exit(1);
}
