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
    default: false,
    type: 'boolean'
  })
  .argv;

try {
  const [packageOrg, packageName] = yargs._[0].split('/');

  replace.sync({
    files: process.cwd() + '/**',
    ignore: 'node_modules/**',
    from: [/{{package-name}}/g, /{{owner}}/g, /{{description}}/g],
    to: [packageName, packageOrg, yargs.description]
  });

  fs.unlinkSync('README.md');
  fs.renameSync('README.template.md', 'README.md');

  if (!yargs.dev) {
    fs.unlinkSync('init.js');

    exec('npm un -D replace-in-file yargs').on('exit', (code) => {
      process.exit(code);
    });
  }

  return process.exit(0);
} catch (e) {
  console.error(`Please, make sure you have provided the package information in the following format:
  node init {github-username-or-org}/{package-name}`);

  console.error(e);

  return process.exit(1);
}
