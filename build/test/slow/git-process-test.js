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
const auth_1 = require("./auth");
const temp = require('temp').track();
describe('git-process', () => {
    describe('clone', () => {
        it('returns exit code and error when repository doesn\'t exist', () => __awaiter(this, void 0, void 0, function* () {
            const testRepoPath = temp.mkdirSync('desktop-git-test-blank');
            const options = {
                env: auth_1.setupNoAuth()
            };
            // GitHub will prompt for (and validate) credentials for non-public
            // repositories, to prevent leakage of information.
            // Bitbucket will not prompt for credentials, and will immediately
            // return whether this non-public repository exists.
            //
            // This is an easier to way to test for the specific error than to
            // pass live account credentials to Git.
            const result = yield lib_1.GitProcess.exec(['clone', '--', 'https://bitbucket.org/shiftkey/testing-non-existent.git', '.'], testRepoPath, options);
            helpers_1.verify(result, r => {
                expect(r.exitCode).to.equal(128);
            });
            const error = lib_1.GitProcess.parseError(result.stderr);
            expect(error).to.equal(lib_1.GitError.HTTPSRepositoryNotFound);
        }));
        it('returns exit code and error when repository requires credentials', () => __awaiter(this, void 0, void 0, function* () {
            const testRepoPath = temp.mkdirSync('desktop-git-test-blank');
            const options = {
                env: auth_1.setupAskPass('error', 'error')
            };
            const result = yield lib_1.GitProcess.exec(['clone', '--', 'https://github.com/shiftkey/repository-private.git', '.'], testRepoPath, options);
            helpers_1.verify(result, r => {
                expect(r.exitCode).to.equal(128);
            });
            const error = lib_1.GitProcess.parseError(result.stderr);
            expect(error).to.equal(lib_1.GitError.HTTPSAuthenticationFailed);
        }));
        it('returns exit code when successful', () => __awaiter(this, void 0, void 0, function* () {
            const testRepoPath = temp.mkdirSync('desktop-git-clone-valid');
            const options = {
                env: auth_1.setupNoAuth()
            };
            const result = yield lib_1.GitProcess.exec(['clone', '--', 'https://github.com/shiftkey/friendly-bassoon.git', '.'], testRepoPath, options);
            helpers_1.verify(result, r => {
                expect(r.exitCode).to.equal(0);
            });
        }));
    });
    describe('fetch', () => {
        it('returns exit code and error when repository doesn\'t exist', () => __awaiter(this, void 0, void 0, function* () {
            const testRepoPath = yield helpers_1.initialize('desktop-git-fetch-failure');
            // GitHub will prompt for (and validate) credentials for non-public
            // repositories, to prevent leakage of information.
            // Bitbucket will not prompt for credentials, and will immediately
            // return whether this non-public repository exists.
            //
            // This is an easier to way to test for the specific error than to
            // pass live account credentials to Git.
            const addRemote = yield lib_1.GitProcess.exec(['remote', 'add', 'origin', 'https://bitbucket.org/shiftkey/testing-non-existent.git'], testRepoPath);
            helpers_1.verify(addRemote, r => {
                expect(r.exitCode).to.equal(0);
            });
            const options = {
                env: auth_1.setupNoAuth()
            };
            const result = yield lib_1.GitProcess.exec(['fetch', 'origin'], testRepoPath, options);
            helpers_1.verify(result, r => {
                expect(r.exitCode).to.equal(128);
            });
            const error = lib_1.GitProcess.parseError(result.stderr);
            expect(error).to.equal(lib_1.GitError.HTTPSRepositoryNotFound);
        }));
        it('returns exit code and error when repository requires credentials', () => __awaiter(this, void 0, void 0, function* () {
            const testRepoPath = yield helpers_1.initialize('desktop-git-fetch-failure');
            const addRemote = yield lib_1.GitProcess.exec(['remote', 'add', 'origin', 'https://github.com/shiftkey/repository-private.git'], testRepoPath);
            helpers_1.verify(addRemote, r => {
                expect(r.exitCode).to.equal(0);
            });
            const options = {
                env: auth_1.setupAskPass('error', 'error')
            };
            const result = yield lib_1.GitProcess.exec(['fetch', 'origin'], testRepoPath, options);
            helpers_1.verify(result, r => {
                expect(r.exitCode).to.equal(128);
            });
            const error = lib_1.GitProcess.parseError(result.stderr);
            expect(error).to.equal(lib_1.GitError.HTTPSAuthenticationFailed);
        }));
        it('returns exit code when successful', () => __awaiter(this, void 0, void 0, function* () {
            const testRepoPath = yield helpers_1.initialize('desktop-git-fetch-valid');
            const addRemote = yield lib_1.GitProcess.exec(['remote', 'add', 'origin', 'https://github.com/shiftkey/friendly-bassoon.git'], testRepoPath);
            helpers_1.verify(addRemote, r => {
                expect(r.exitCode).to.equal(0);
            });
            const options = {
                env: auth_1.setupNoAuth()
            };
            const result = yield lib_1.GitProcess.exec(['fetch', 'origin'], testRepoPath, options);
            helpers_1.verify(result, r => {
                expect(r.exitCode).to.equal(0);
            });
        }));
    });
});
//# sourceMappingURL=git-process-test.js.map