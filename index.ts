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
    rl.question("Theme to be downloaded: ", (THEME: string) => {
        rl.question("Theme's Git repository: ", (THEME_REPO: string) => {
            rl.close();
            generateSite(SITE_NAME, THEME_REPO, THEME);
            copyDefaults(SITE_NAME, THEME)
        })
    });
});

rl.on("close", function() {
    console.log("\nThanks!\n");
});
export const generateSite = (site: string, repo: string, theme: string) => {
    execSync(`hugo new site ${site}`);
    execSync(`cd ${site} && git init`);
    execSync(`cd ${site} && git submodule add ${repo} themes/${theme}`);
};

export const copyDefaults = (site: string, theme: string) => {
    ncp(`${site}/themes/${theme}/exampleSite`, `${site}`, (err) => {
        if (err) {
            return console.error(err)
        }

        console.log('Data from /exampleSite copied');
        process.exit(0);
    })
}

