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
const chai = require("chai");
const expect = chai.expect;
const Fs = require("fs");
const Path = require("path");
const lib_1 = require("../../lib");
const helpers_1 = require("../helpers");
const temp = require('temp').track();
const maximumStringSize = 268435441;
function bufferOutput(process, failPromiseWhenLengthExceeded = true) {
    return new Promise((resolve, reject) => {
        const stdout = [];
        process.stdout.on('data', (chunk) => {
            if (chunk instanceof Buffer) {
                stdout.push(chunk);
            }
            else {
                stdout.push(Buffer.from(chunk));
            }
        });
        process.on('exit', () => {
            const output = Buffer.concat(stdout);
            if (failPromiseWhenLengthExceeded && output.length >= maximumStringSize) {
                reject(new Error(`Process output is greater than known V8 limit on string size: ${maximumStringSize} bytes`));
            }
            else {
                resolve(output.toString());
            }
        });
    });
}
describe('GitProcess.spawn', () => {
    it('can launch git', () => __awaiter(this, void 0, void 0, function* () {
        const process = lib_1.GitProcess.spawn(['--version'], __dirname);
        const result = yield bufferOutput(process);
        expect(result).to.contain(`git version ${helpers_1.gitVersion}`);
    }));
    it('returns expected exit codes', (done) => {
        const directory = temp.mkdirSync('desktop-not-a-repo');
        const process = lib_1.GitProcess.spawn(['status'], directory);
        process.on('exit', (code, signal) => {
            if (code === 0) {
                done(new Error('the exit code returned was zero which was unexpected'));
            }
            else {
                done();
            }
        });
    });
    it('can fail safely with a diff exceeding the string length', (done) => {
        const testRepoPath = temp.mkdirSync('desktop-git-spwawn-empty');
        lib_1.GitProcess.exec(['init'], testRepoPath);
        // write this file in two parts to ensure we don't trip the string length limits
        const filePath = Path.join(testRepoPath, 'file.txt');
        const pointInTime = 100000000;
        const firstBufferLength = maximumStringSize - pointInTime;
        const secondBufferLength = pointInTime;
        const firstBuffer = Buffer.alloc(firstBufferLength);
        firstBuffer.fill('a');
        const secondBuffer = Buffer.alloc(secondBufferLength);
        secondBuffer.fill('b');
        Fs.appendFileSync(filePath, firstBuffer.toString('utf-8'));
        Fs.appendFileSync(filePath, secondBuffer.toString('utf-8'));
        const process = lib_1.GitProcess.spawn(['diff', '--no-index', '--patch-with-raw', '-z', '--', '/dev/null', 'file.txt'], testRepoPath);
        bufferOutput(process)
            .then(o => {
            done(new Error('The diff was returned as-is, which should never happen'));
        })
            .catch(err => {
            done();
        });
    });
});
//# sourceMappingURL=git-spawn-test.js.map