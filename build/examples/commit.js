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
// for readability, let's alias this
const git = _1.GitProcess.exec;
function isUnbornRepository(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield git(['rev-parse', '--verify', 'HEAD^{commit}'], path);
        if (result.exitCode === 0) {
            return true;
        }
        else {
            // we might have 128 here, or some other status code
            // but whatever
            return false;
        }
    });
}
exports.isUnbornRepository = isUnbornRepository;
function createCommit(path, message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield isUnbornRepository(path)) {
            // for an unborn repository we don't have access to HEAD
            // so a simple `git reset` here is fine
            yield git(['reset'], path);
        }
        else {
            yield git(['reset', 'HEAD', '--mixed'], path);
        }
        // ensure that untracked files are also staged
        yield git(['add', '.'], path);
        yield git(['add', '-u', '.'], path);
        const result = yield git(['commit', '-F', '-'], path, { stdin: message });
        if (result.exitCode !== 0) {
            const error = _1.GitProcess.parseError(result.stderr);
            if (error) {
                console.log(`Got error code: ${error}`);
            }
            else {
                console.log(`Could not parse error: ${result.stderr}`);
            }
        }
    });
}
exports.createCommit = createCommit;
//# sourceMappingURL=commit.js.map