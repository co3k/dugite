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
const lib_1 = require("../../lib");
const helpers_1 = require("../helpers");
const Fs = require("fs");
const Path = require("path");
const temp = require('temp').track();
describe('commit', () => {
    it('can commit changes', () => __awaiter(this, void 0, void 0, function* () {
        const testRepoPath = temp.mkdirSync('desktop-git-test-commit');
        yield lib_1.GitProcess.exec(['init'], testRepoPath);
        // for CI environments, no user info set - so let's stub something in the repo
        yield lib_1.GitProcess.exec(['config', 'user.email', '"test@example.com"'], testRepoPath);
        yield lib_1.GitProcess.exec(['config', 'user.name', '"Some Test User"'], testRepoPath);
        const readme = Path.join(testRepoPath, 'README.md');
        Fs.writeFileSync(readme, 'HELLO WORLD!');
        yield lib_1.GitProcess.exec(['add', 'README.md'], testRepoPath);
        const message = 'committed the README';
        const result = yield lib_1.GitProcess.exec(['commit', '-F', '-'], testRepoPath, { stdin: message });
        helpers_1.verify(result, r => {
            expect(r.exitCode).to.equal(0);
            expect(r.stdout).to.contain(message);
        });
    }));
});
//# sourceMappingURL=commit.js.map