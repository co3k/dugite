"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("../lib/");
const byline = require('byline');
const ProgressBar = require('progress');
const progressBarOptions = {
    complete: '=',
    incomplete: ' ',
    width: 50,
    total: 100
};
function tryParse(str) {
    const value = /(\d+)\%/.exec(str);
    if (value) {
        const percentValue = value[1];
        const percent = parseInt(percentValue, 10);
        if (!isNaN(percent)) {
            return percent;
        }
    }
    return null;
}
let receivingObjectsBar = null;
function setReceivingProgress(percent) {
    if (!receivingObjectsBar) {
        receivingObjectsBar = new ProgressBar('Receiving objects [:bar] :percent', progressBarOptions);
    }
    receivingObjectsBar.update(percent / 100);
}
let resolvingDeltasBar = null;
function setResolvingProgress(percent) {
    if (!resolvingDeltasBar) {
        resolvingDeltasBar = new ProgressBar('Resolving deltas [:bar] :percent', progressBarOptions);
    }
    resolvingDeltasBar.update(percent / 100);
}
function performClone() {
    return __awaiter(this, void 0, void 0, function* () {
        const path = 'C:/some/path/on/disk';
        const options = {
            // enable diagnostics
            env: {
                'GIT_HTTP_USER_AGENT': 'dugite/2.12.0',
            },
            processCallback: (process) => {
                byline(process.stderr).on('data', (chunk) => {
                    if (chunk.startsWith('Receiving objects: ')) {
                        const percent = tryParse(chunk);
                        if (percent) {
                            setReceivingProgress(percent);
                        }
                        return;
                    }
                    if (chunk.startsWith('Resolving deltas: ')) {
                        const percent = tryParse(chunk);
                        if (percent) {
                            setResolvingProgress(percent);
                        }
                        return;
                    }
                });
            }
        };
        const result = yield _1.GitProcess.exec(['clone', 'https://github.com/dugite/dugite', '--progress'], path, options);
        if (result.exitCode !== 0) {
            console.log(`Unable to clone, exit code ${result.exitCode}`);
            console.log(result.stderr);
        }
        else {
            console.log('Clone completed');
        }
    });
}
performClone();
//# sourceMappingURL=api-extensibility.js.map