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
  })).then(() => {
    fs.unlinkSync('README.md');
    fs.renameSync('README.template.md', 'README.md');

    exec('npm un -D replace-in-file yargs').on('exit', (code) => {
      process.exit(code);
    });

    fs.unlinkSync('init.js');

    process.exit(0);
  });
} catch (e) {
  console.error(`Please, make sure you have provided the package information in the following format:
  node init {github-username-or-org}/{package-name}`);

  console.error(e);

  return process.exit(1);
}
