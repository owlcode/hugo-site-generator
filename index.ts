#!/usr/bin/env node
import {
    execSync
} from 'child_process';
import ncp from 'ncp';
import {stdin, stdout} from 'process';

const gettext = (x: string) => x; 

const readline = require("readline");
const rl = readline.createInterface({
    input: stdin,
    output: stdout
});

rl.question(gettext("New site name: "), (SITE_NAME: string) => {
    rl.question("Theme's Git repository: ", (THEME_REPO: string) => {
        const THEME = THEME_REPO.split('/').pop()?.split('.')[0];
        if (THEME) {
            rl.close();
            generateSite(SITE_NAME, THEME_REPO, THEME);
            copyDefaults(SITE_NAME, THEME)
        } else {
            rl.question("Theme's name: ", (name: string) => {
                rl.close();
                generateSite(SITE_NAME, THEME_REPO, name);
                copyDefaults(SITE_NAME, name)
            });
        } 
    });
});

rl.on("close", function() {
    console.log("\nThanks!\n");
});
export const generateSite = (site: string, repo: string, theme: string) => {
    execSync(`hugo new site ${site}`);
    execSync(`cd ${site} && git init`);
    execSync(`cd ${site} && git submodule add ${repo} themes/${theme}`);
    execSync(`cd ${site} && git add * && git commit -m 'Initial commit for ${site}'`);
};

export const copyDefaults = (site: string, theme: string) => {
    ncp(`${site}/themes/${theme}/exampleSite`, `${site}`, (err) => {
        if (err) {
            console.warn('Not found /exampleSite folder. Copy whole git repo into main folder.')
            ncp(`${site}/themes/${theme}`, `${site}`, {
                filter: (fileName) => !([
                    '.git',
                    'README.md'
                ].includes(fileName))
            }, (err) => {
                return console.error('Failed', err)
            });
        }

        console.log('Data from /exampleSite copied');
        process.exit(0);
    })
}

