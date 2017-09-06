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
const temp = require('temp').track();
describe('stdin', () => {
    it('can write large buffers', () => __awaiter(this, void 0, void 0, function* () {
        // Allocate 10Mb of memory
        const buffer = Buffer.alloc(1024 * 1024 * 10);
        // Ensure it's all filled with zeroes
        buffer.fill(0);
        const testRepoPath = temp.mkdirSync('desktop-git-test-large-input');
        // Hash the object (without writing it to object database)
        const result = yield lib_1.GitProcess.exec(['hash-object', '--stdin'], testRepoPath, { stdin: buffer });
        // Ensure that 10Mb of zeroes hashes correctly
        expect(result.stdout).to.equal('6c5d4031e03408e34ae476c5053ee497a91ac37b\n');
    }));
    it('can write strings', () => __awaiter(this, void 0, void 0, function* () {
        const testRepoPath = temp.mkdirSync('desktop-git-test-input-string');
        // Hash the object (without writing it to object database)
        const result = yield lib_1.GitProcess.exec(['hash-object', '--stdin'], testRepoPath, {
            stdin: 'foo bar'
        });
        expect(result.stdout).to.equal('96c906756d7b91c45322617c9295e4a80d52d1c5\n');
    }));
    it('can write strings with encoding', () => __awaiter(this, void 0, void 0, function* () {
        const testRepoPath = temp.mkdirSync('desktop-git-test-input-string');
        // Hash the object (without writing it to object database)
        const result1 = yield lib_1.GitProcess.exec(['hash-object', '--stdin'], testRepoPath, {
            stdin: 'åäö',
            stdinEncoding: 'utf-8'
        });
        expect(result1.stdout).to.equal('3889b04ced1aef334c8caaa923559abba286394e\n');
        // Hash the object (without writing it to object database)
        const result2 = yield lib_1.GitProcess.exec(['hash-object', '--stdin'], testRepoPath, {
            stdin: 'åäö',
            stdinEncoding: 'ascii'
        });
        expect(result2.stdout).to.equal('652b06b434a5750d876f9eb55c07c0f1fab93464\n');
    }));
    it('assumes utf-8 for stdin by default', () => __awaiter(this, void 0, void 0, function* () {
        const testRepoPath = temp.mkdirSync('desktop-git-test-input-string');
        // Hash the object (without writing it to object database)
        const result = yield lib_1.GitProcess.exec(['hash-object', '--stdin'], testRepoPath, {
            stdin: 'åäö',
        });
        expect(result.stdout).to.equal('3889b04ced1aef334c8caaa923559abba286394e\n');
    }));
});
//# sourceMappingURL=stdin-test.js.map