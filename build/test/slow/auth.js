"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
function getAskPassScriptPath() {
    const testRoot = Path.dirname(__dirname);
    const projectRoot = Path.dirname(testRoot);
    return Path.join(projectRoot, 'build', 'test', 'auth', `main.js`);
}
function getAskPassTrampolinePath() {
    const isWindows = process.platform === 'win32';
    const extension = isWindows ? 'bat' : 'sh';
    const testRoot = Path.dirname(__dirname);
    const projectRoot = Path.dirname(testRoot);
    return Path.join(projectRoot, 'test', 'auth', `ask-pass.${extension}`);
}
const defaultEnv = {
    // supported since Git 2.3, this is used to ensure we never interactively prompt
    // for credentials - even as a fallback
    GIT_TERMINAL_PROMPT: '0',
    // by setting HOME to an empty value Git won't look at ~ for any global
    // configuration values. This means we won't accidentally use a
    // credential.helper value if it's been set by the current user
    HOME: '',
};
function setupAskPass(username, password) {
    const auth = {
        TEST_USERNAME: username,
        TEST_PASSWORD: password,
        ASKPASS_MAIN: getAskPassScriptPath(),
        GIT_ASKPASS: getAskPassTrampolinePath(),
    };
    return Object.assign(auth, defaultEnv);
}
exports.setupAskPass = setupAskPass;
function setupNoAuth() {
    return defaultEnv;
}
exports.setupNoAuth = setupNoAuth;
//# sourceMappingURL=auth.js.map