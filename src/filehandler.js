import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import chalk from 'chalk';
import shell from 'shelljs';

const MODE_0666 = parseInt('0666', 8);
const MODE_0755 = parseInt('0755', 8);
const TEMPLATE_DIR = path.join(__dirname, '..', 'templates');

const write = (file, str, mode) => {
    fs.writeFileSync(file, str, { mode: mode || MODE_0666, });
    shell.echo(`${chalk.cyanBright('   create: ')}${file}`);
};

const mkdir = (base, dir = '.') => {
    const loc = path.join(base, dir);
    mkdirp.sync(loc, MODE_0755);
    shell.echo(`${chalk.cyanBright('   create: ')}${loc}${path.sep}`);
};

const copyTemplate = (from, to) => {
    if (fs.lstatSync(path.join(TEMPLATE_DIR, from)).isDirectory()) {
        if (!fs.existsSync(to)) {
            mkdir(to);
        }
        copyTemplateMulti(from, to);
    } else {
        write(to, fs.readFileSync(path.join(TEMPLATE_DIR, from), 'utf-8'));
    }
};

const copyTemplateMulti = (fromDir, toDir, excludes) => {
    fs.readdirSync(path.join(TEMPLATE_DIR, fromDir))
        .filter(!!excludes ? file => excludes.indexOf(file) === -1 : () => true)
        .forEach(name => void (copyTemplate(path.join(fromDir, name), path.join(toDir, name))));
};

export default { write, mkdir, copyTemplate, copyTemplateMulti, };