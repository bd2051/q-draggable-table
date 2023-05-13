process.env.NODE_ENV = 'production';

const parallel = require('os').cpus().length > 1;
const runJob = parallel ? require('child_process').fork : require;
const { join } = require('path');
const { green, blue } = require('chalk');
const { createFolder } = require('./utils');

console.log();

require('./script.clean.js');

console.log(` 📦 Building ${green(`v${require('../package.json').version}`)}...${parallel ? blue(' [multi-threaded]') : ''}\n`);

createFolder('dist');

runJob(join(__dirname, './script.javascript.js'));
runJob(join(__dirname, './script.css.js'));
