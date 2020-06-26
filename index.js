#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

const targetDir = process.argv[2] || process.cwd();

fs.readdir(targetDir, async (err, filenames) => {
    if (err !== null) {
        console.log(err)
        return;
    }

    const statPromises = filenames.map(filename => {
        return lstat(path.join(targetDir, filename))
    });

    const allStats = await Promise.all(statPromises);

    for (let stats of allStats) {
        const index = allStats.indexOf(stats);

        if (stats.isFile()) console.log(filenames[index])
        else console.log(chalk.bold(filenames[index]))
    }
});

const lstat = filename => {
    return new Promise((res, rej) => {
        fs.lstat(filename, (err, stats) => {
            if (err !== null) {
                rej(err);
            }
            res(stats);
        });
    });
}
