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
const lib_1 = require("../lib");
// NOTE: bump these versions to the latest stable releases
exports.gitVersion = '2.14.1';
exports.gitLfsVersion = '2.2.1';
const temp = require('temp').track();
function initialize(repositoryName) {
    return __awaiter(this, void 0, void 0, function* () {
        const testRepoPath = temp.mkdirSync(`desktop-git-test-${repositoryName}`);
        yield lib_1.GitProcess.exec(['init'], testRepoPath);
        yield lib_1.GitProcess.exec(['config', 'user.email', '"some.user@email.com"'], testRepoPath);
        yield lib_1.GitProcess.exec(['config', 'user.name', '"Some User"'], testRepoPath);
        return testRepoPath;
    });
}
exports.initialize = initialize;
function verify(result, callback) {
    try {
        callback(result);
    }
    catch (e) {
        console.log('error encountered while verifying; poking at response from Git:');
        console.log(` - exitCode: ${result.exitCode}`);
        console.log(` - stdout: ${result.stdout.trim()}`);
        console.log(` - stderr: ${result.stderr.trim()}`);
        console.log();
        throw e;
    }
}
exports.verify = verify;
//# sourceMappingURL=helpers.js.map