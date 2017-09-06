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
const os = require("os");
describe('config', () => {
    it('sets http.sslBackend on Windows', () => __awaiter(this, void 0, void 0, function* () {
        if (process.platform === 'win32') {
            const result = yield lib_1.GitProcess.exec(['config', '--system', 'http.sslBackend'], os.homedir());
            expect(result.stdout.trim()).to.equal('schannel');
        }
    }));
});
//# sourceMappingURL=config-test.js.map