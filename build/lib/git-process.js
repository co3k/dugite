"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const child_process_1 = require("child_process");
const errors_1 = require("./errors");
const git_environment_1 = require("./git-environment");
class GitProcess {
    static pathExists(path) {
        try {
            fs.accessSync(path, fs.F_OK);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    /**
     * Execute a command and interact with the process outputs directly.
     *
     * The returned promise will reject when the git executable fails to launch,
     * in which case the thrown Error will have a string `code` property. See
     * `errors.ts` for some of the known error codes.
     */
    static spawn(args, path, options) {
        let customEnv = {};
        if (options && options.env) {
            customEnv = options.env;
        }
        const { env, gitLocation } = git_environment_1.setupEnvironment(customEnv);
        const spawnArgs = {
            env,
            cwd: path
        };
        const spawnedProcess = child_process_1.spawn(gitLocation, args, spawnArgs);
        return spawnedProcess;
    }
    /**
     * Execute a command and read the output using the embedded Git environment.
     *
     * The returned promise will reject when the git executable fails to launch,
     * in which case the thrown Error will have a string `code` property. See
     * `errors.ts` for some of the known error codes.
     *
     * See the result's `stderr` and `exitCode` for any potential git error
     * information.
     */
    static exec(args, path, options) {
        return new Promise(function (resolve, reject) {
            let customEnv = {};
            if (options && options.env) {
                customEnv = options.env;
            }
            const { env, gitLocation } = git_environment_1.setupEnvironment(customEnv);
            // Explicitly annotate opts since typescript is unable to infer the correct
            // signature for execFile when options is passed as an opaque hash. The type
            // definition for execFile currently infers based on the encoding parameter
            // which could change between declaration time and being passed to execFile.
            // See https://git.io/vixyQ
            const execOptions = {
                cwd: path,
                encoding: 'utf8',
                maxBuffer: options ? options.maxBuffer : 10 * 1024 * 1024,
                env
            };
            const spawnedProcess = child_process_1.execFile(gitLocation, args, execOptions, function (err, stdout, stderr) {
                const code = err ? err.code : 0;
                // If the error's code is a string then it means the code isn't the
                // process's exit code but rather an error coming from Node's bowels,
                // e.g., ENOENT.
                if (typeof code === 'string') {
                    if (code === 'ENOENT') {
                        let message = err.message;
                        let code = err.code;
                        if (GitProcess.pathExists(path) === false) {
                            message = 'Unable to find path to repository on disk.';
                            code = errors_1.RepositoryDoesNotExistErrorCode;
                        }
                        else {
                            message = `Git could not be found at the expected path: '${gitLocation}'. This might be a problem with how the application is packaged, so confirm this folder hasn't been removed when packaging.`;
                            code = errors_1.GitNotFoundErrorCode;
                        }
                        const error = new Error(message);
                        error.name = err.name;
                        error.code = code;
                        reject(error);
                    }
                    else {
                        reject(err);
                    }
                    return;
                }
                if (code === undefined && err) {
                    // Git has returned an output that couldn't fit in the specified buffer
                    // as we don't know how many bytes it requires, rethrow the error with
                    // details about what it was previously set to...
                    if (err.message === 'stdout maxBuffer exceeded') {
                        reject(new Error(`The output from the command could not fit into the allocated stdout buffer. Set options.maxBuffer to a larger value than ${execOptions.maxBuffer} bytes`));
                    }
                }
                resolve({ stdout, stderr, exitCode: code });
            });
            if (options && options.stdin) {
                // See https://github.com/nodejs/node/blob/7b5ffa46fe4d2868c1662694da06eb55ec744bde/test/parallel/test-stdin-pipe-large.js
                spawnedProcess.stdin.end(options.stdin, options.stdinEncoding);
            }
            if (options && options.processCallback) {
                options.processCallback(spawnedProcess);
            }
        });
    }
    /** Try to parse an error type from stderr. */
    static parseError(stderr) {
        for (const regex in errors_1.GitErrorRegexes) {
            if (stderr.match(regex)) {
                const error = errors_1.GitErrorRegexes[regex];
                return error;
            }
        }
        return null;
    }
}
exports.GitProcess = GitProcess;
//# sourceMappingURL=git-process.js.map