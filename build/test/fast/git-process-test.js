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
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const lib_1 = require("../../lib");
const helpers_1 = require("../helpers");
const helpers_2 = require("../helpers");
const temp = require('temp').track();
describe('git-process', () => {
    it('can launch git', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield lib_1.GitProcess.exec(['--version'], __dirname);
        helpers_1.verify(result, r => {
            expect(r.stdout).to.contain(`git version ${helpers_2.gitVersion}`);
        });
    }));
    describe('exitCode', () => {
        it('returns exit code when folder is empty', () => __awaiter(this, void 0, void 0, function* () {
            const testRepoPath = temp.mkdirSync('desktop-git-test-blank');
            const result = yield lib_1.GitProcess.exec(['show', 'HEAD'], testRepoPath);
            helpers_1.verify(result, r => {
                expect(r.exitCode).to.equal(128);
            });
        }));
        describe('diff', () => {
            it('returns expected error code for initial commit when creating diff', () => __awaiter(this, void 0, void 0, function* () {
                const testRepoPath = yield helpers_1.initialize('blank-no-commits');
                const file = path.join(testRepoPath, 'new-file.md');
                fs.writeFileSync(file, 'this is a new file');
                const result = yield lib_1.GitProcess.exec(['diff', '--no-index', '--patch-with-raw', '-z', '--', '/dev/null', 'new-file.md'], testRepoPath);
                helpers_1.verify(result, r => {
                    expect(r.exitCode).to.equal(1);
                    expect(r.stdout.length).to.be.greaterThan(0);
                });
            }));
            it('returns expected error code for repository with history when creating diff', () => __awaiter(this, void 0, void 0, function* () {
                const testRepoPath = yield helpers_1.initialize('blank-then-commit');
                const readme = path.join(testRepoPath, 'README.md');
                fs.writeFileSync(readme, 'hello world!');
                yield lib_1.GitProcess.exec(['add', '.'], testRepoPath);
                const commit = yield lib_1.GitProcess.exec(['commit', '-F', '-'], testRepoPath, { stdin: 'hello world!' });
                expect(commit.exitCode).to.eq(0);
                const file = path.join(testRepoPath, 'new-file.md');
                fs.writeFileSync(file, 'this is a new file');
                const result = yield lib_1.GitProcess.exec(['diff', '--no-index', '--patch-with-raw', '-z', '--', '/dev/null', 'new-file.md'], testRepoPath);
                helpers_1.verify(result, r => {
                    expect(r.exitCode).to.equal(1);
                    expect(r.stdout.length).to.be.greaterThan(0);
                });
            }));
            it('throws error when exceeding the output range', () => __awaiter(this, void 0, void 0, function* () {
                const testRepoPath = temp.mkdirSync('blank-then-large-file');
                // NOTE: if we change the default buffer size in git-process
                // this test may no longer fail as expected - see https://git.io/v1dq3
                const output = crypto.randomBytes(10 * 1024 * 1024).toString('hex');
                const file = path.join(testRepoPath, 'new-file.md');
                fs.writeFileSync(file, output);
                let throws = false;
                try {
                    yield lib_1.GitProcess.exec(['diff', '--no-index', '--patch-with-raw', '-z', '--', '/dev/null', 'new-file.md'], testRepoPath);
                }
                catch (e) {
                    throws = true;
                }
                expect(throws).to.be.true;
            }));
        });
    });
    describe('errors', () => {
        it('raises error when folder does not exist', () => __awaiter(this, void 0, void 0, function* () {
            const testRepoPath = path.join(temp.path(), 'desktop-does-not-exist');
            let error = null;
            try {
                yield lib_1.GitProcess.exec(['show', 'HEAD'], testRepoPath);
            }
            catch (e) {
                error = e;
            }
            expect(error.message).to.equal('Unable to find path to repository on disk.');
            expect(error.code).to.equal(lib_1.RepositoryDoesNotExistErrorCode);
        }));
        it('can parse errors', () => {
            const error = lib_1.GitProcess.parseError('fatal: Authentication failed');
            expect(error).to.equal(lib_1.GitError.SSHAuthenticationFailed);
        });
        it('can parse bad revision errors', () => {
            const error = lib_1.GitProcess.parseError("fatal: bad revision 'beta..origin/beta'");
            expect(error).to.equal(lib_1.GitError.BadRevision);
        });
        it('can parse unrelated histories error', () => {
            const stderr = `fatal: refusing to merge unrelated histories`;
            const error = lib_1.GitProcess.parseError(stderr);
            expect(error).to.equal(lib_1.GitError.CannotMergeUnrelatedHistories);
        });
        it('can parse GH001 push file size error', () => {
            const stderr = `remote: error: GH001: Large files detected. You may want to try Git Large File Storage - https://git-lfs.github.com.
remote: error: Trace: 2bd2bfca1605d4e0847936332f1b6c07
remote: error: See http://git.io/iEPt8g for more information.
remote: error: File some-file.mp4 is 292.85 MB; this exceeds GitHub's file size limit of 100.00 MB
To https://github.com/shiftkey/too-large-repository.git
 ! [remote rejected] master -> master (pre-receive hook declined)
error: failed to push some refs to 'https://github.com/shiftkey/too-large-repository.git'`;
            const error = lib_1.GitProcess.parseError(stderr);
            expect(error).to.equal(lib_1.GitError.PushWithFileSizeExceedingLimit);
        });
        it('can parse GH002 branch name error', () => {
            const stderr = `remote: error: GH002: Sorry, branch or tag names consisting of 40 hex characters are not allowed.
remote: error: Invalid branch or tag name "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
To https://github.com/shiftkey/too-large-repository.git
 ! [remote rejected] aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa -> aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa (pre-receive hook declined)
error: failed to push some refs to 'https://github.com/shiftkey/too-large-repository.git'`;
            const error = lib_1.GitProcess.parseError(stderr);
            expect(error).to.equal(lib_1.GitError.HexBranchNameRejected);
        });
        it('can parse GH003 force push error', () => {
            const stderr = `remote: error: GH003: Sorry, force-pushing to my-cool-branch is not allowed.
To https://github.com/shiftkey/too-large-repository.git
 ! [remote rejected]  my-cool-branch ->  my-cool-branch (pre-receive hook declined)
error: failed to push some refs to 'https://github.com/shiftkey/too-large-repository.git'`;
            const error = lib_1.GitProcess.parseError(stderr);
            expect(error).to.equal(lib_1.GitError.ForcePushRejected);
        });
        it('can parse GH005 ref length error', () => {
            const stderr = `remote: error: GH005: Sorry, refs longer than 255 bytes are not allowed.
To https://github.com/shiftkey/too-large-repository.git
...`;
            // there's probably some output here missing but I couldn't trigger this locally
            const error = lib_1.GitProcess.parseError(stderr);
            expect(error).to.equal(lib_1.GitError.InvalidRefLength);
        });
        it('can parse GH006 protected branch push error', () => {
            const stderr = `remote: error: GH006: Protected branch update failed for refs/heads/master.
remote: error: At least one approved review is required
To https://github.com/shiftkey-tester/protected-branches.git
 ! [remote rejected] master -> master (protected branch hook declined)
error: failed to push some refs to 'https://github.com/shiftkey-tester/protected-branches.git'`;
            const error = lib_1.GitProcess.parseError(stderr);
            expect(error).to.equal(lib_1.GitError.ProtectedBranchRequiresReview);
        });
        it('can parse GH006 protected branch force push error', () => {
            const stderr = `remote: error: GH006: Protected branch update failed for refs/heads/master.
remote: error: Cannot force-push to a protected branch
To https://github.com/shiftkey/too-large-repository.git
 ! [remote rejected] master -> master (protected branch hook declined)
error: failed to push some refs to 'https://github.com/shiftkey/too-large-repository.git'`;
            const error = lib_1.GitProcess.parseError(stderr);
            expect(error).to.equal(lib_1.GitError.ProtectedBranchForcePush);
        });
        it('can parse GH007 push with private email error', () => {
            const stderr = `remote: error: GH007: Your push would publish a private email address.
remote: You can make your email public or disable this protection by visiting:
remote: http://github.com/settings/emails`;
            const error = lib_1.GitProcess.parseError(stderr);
            expect(error).to.equal(lib_1.GitError.PushWithPrivateEmail);
        });
    });
});
//# sourceMappingURL=git-process-test.js.map