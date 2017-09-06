"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Parse the GIT_ASKPASS prompt and determine the appropriate response. */
function responseForPrompt(prompt) {
    const username = process.env.TEST_USERNAME;
    if (!username || !username.length) {
        return null;
    }
    if (prompt.startsWith('Username')) {
        return username;
    }
    const password = process.env.TEST_PASSWORD;
    if (!password || !password.length) {
        return null;
    }
    if (prompt.startsWith('Password')) {
        return password;
    }
    return null;
}
exports.responseForPrompt = responseForPrompt;
const prompt = process.argv[2];
const response = responseForPrompt(prompt);
if (response) {
    process.stdout.write(response);
}
//# sourceMappingURL=main.js.map