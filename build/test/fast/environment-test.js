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
const git_environment_1 = require("../../lib/git-environment");
const temp = require('temp').track();
describe('environment variables', () => {
    it('can set them', () => __awaiter(this, void 0, void 0, function* () {
        const testRepoPath = temp.mkdirSync('desktop-git-test-environment');
        const result = yield lib_1.GitProcess.exec(['var', 'GIT_AUTHOR_IDENT'], testRepoPath, {
            env: {
                'GIT_AUTHOR_NAME': 'Foo Bar',
                'GIT_AUTHOR_EMAIL': 'foo@bar.com',
                'GIT_AUTHOR_DATE': 'Wed, 05 Oct 2016 23:33:27 +0200',
            }
        });
        expect(result.stdout).to.equal('Foo Bar <foo@bar.com> 1475703207 +0200\n');
    }));
    it('when GIT_EXEC_PATH environment variable is *not* set, it will be calculated', () => __awaiter(this, void 0, void 0, function* () {
        expect(process.env.GIT_EXEC_PATH).to.be.undefined;
        const { env } = yield git_environment_1.setupEnvironment({});
        expect(env['GIT_EXEC_PATH']).not.to.be.undefined;
    }));
    it('when GIT_EXEC_PATH environment variable is set, that will be used as is', () => __awaiter(this, void 0, void 0, function* () {
        expect(process.env.GIT_EXEC_PATH).to.be.undefined;
        try {
            process.env.GIT_EXEC_PATH = __filename;
            const { env } = yield git_environment_1.setupEnvironment({});
            expect(env['GIT_EXEC_PATH']).to.be.equal(__filename);
        }
        finally {
            delete process.env.GIT_EXEC_PATH;
        }
    }));
});
//# sourceMappingURL=environment-test.js.map