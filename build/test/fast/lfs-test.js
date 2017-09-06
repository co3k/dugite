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
const temp = require('temp').track();
describe('lfs', () => {
    it('can be resolved', () => __awaiter(this, void 0, void 0, function* () {
        const testRepoPath = temp.mkdirSync('desktop-git-lfs');
        const result = yield lib_1.GitProcess.exec(['lfs'], testRepoPath);
        expect(result.exitCode).to.equal(0);
        expect(result.stdout).to.contain('Git LFS is a system for managing and versioning large files');
    }));
    it('matches the expected version', () => __awaiter(this, void 0, void 0, function* () {
        const testRepoPath = temp.mkdirSync('desktop-git-lfs');
        const result = yield lib_1.GitProcess.exec(['lfs', 'version'], testRepoPath);
        expect(result.exitCode).to.equal(0);
        expect(result.stdout).to.contain(`git-lfs/${helpers_1.gitLfsVersion} `);
    }));
});
//# sourceMappingURL=lfs-test.js.map