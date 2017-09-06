/** The git errors which can be parsed from failed git commands. */
export declare enum GitError {
    SSHKeyAuditUnverified = 0,
    SSHAuthenticationFailed = 1,
    SSHPermissionDenied = 2,
    HTTPSAuthenticationFailed = 3,
    RemoteDisconnection = 4,
    HostDown = 5,
    RebaseConflicts = 6,
    MergeConflicts = 7,
    HTTPSRepositoryNotFound = 8,
    SSHRepositoryNotFound = 9,
    PushNotFastForward = 10,
    BranchDeletionFailed = 11,
    DefaultBranchDeletionFailed = 12,
    RevertConflicts = 13,
    EmptyRebasePatch = 14,
    NoMatchingRemoteBranch = 15,
    NothingToCommit = 16,
    NoSubmoduleMapping = 17,
    SubmoduleRepositoryDoesNotExist = 18,
    InvalidSubmoduleSHA = 19,
    LocalPermissionDenied = 20,
    InvalidMerge = 21,
    InvalidRebase = 22,
    NonFastForwardMergeIntoEmptyHead = 23,
    PatchDoesNotApply = 24,
    BranchAlreadyExists = 25,
    BadRevision = 26,
    NotAGitRepository = 27,
    CannotMergeUnrelatedHistories = 28,
    PushWithFileSizeExceedingLimit = 29,
    HexBranchNameRejected = 30,
    ForcePushRejected = 31,
    InvalidRefLength = 32,
    ProtectedBranchRequiresReview = 33,
    ProtectedBranchForcePush = 34,
    PushWithPrivateEmail = 35,
}
/** A mapping from regexes to the git error they identify. */
export declare const GitErrorRegexes: {
    "ERROR: ([\\s\\S]+?)\\n+\\[EPOLICYKEYAGE\\]\\n+fatal: Could not read from remote repository.": GitError;
    "fatal: Authentication failed for 'https://": GitError;
    "fatal: Authentication failed": GitError;
    "fatal: Could not read from remote repository.": GitError;
    "The requested URL returned error: 403": GitError;
    "fatal: The remote end hung up unexpectedly": GitError;
    "fatal: unable to access '(.+)': Failed to connect to (.+): Host is down": GitError;
    "Failed to merge in the changes.": GitError;
    "(Merge conflict|Automatic merge failed; fix conflicts and then commit the result)": GitError;
    "fatal: repository '(.+)' not found": GitError;
    "ERROR: Repository not found": GitError;
    "\\((non-fast-forward|fetch first)\\)\nerror: failed to push some refs to '.*'": GitError;
    "error: unable to delete '(.+)': remote ref does not exist": GitError;
    "\\[remote rejected\\] (.+) \\(deletion of the current branch prohibited\\)": GitError;
    "error: could not revert .*\nhint: after resolving the conflicts, mark the corrected paths\nhint: with 'git add <paths>' or 'git rm <paths>'\nhint: and commit the result with 'git commit'": GitError;
    "Applying: .*\nNo changes - did you forget to use 'git add'\\?\nIf there is nothing left to stage, chances are that something else\n.*": GitError;
    "There are no candidates for (rebasing|merging) among the refs that you just fetched.\nGenerally this means that you provided a wildcard refspec which had no\nmatches on the remote end.": GitError;
    "nothing to commit": GitError;
    "No submodule mapping found in .gitmodules for path '(.+)'": GitError;
    "fatal: repository '(.+)' does not exist\nfatal: clone of '.+' into submodule path '(.+)' failed": GitError;
    "Fetched in submodule path '(.+)', but it did not contain (.+). Direct fetching of that commit failed.": GitError;
    "fatal: could not create work tree dir '(.+)'.*: Permission denied": GitError;
    "merge: (.+) - not something we can merge": GitError;
    "invalid upstream (.+)": GitError;
    "fatal: Non-fast-forward commit does not make sense into an empty head": GitError;
    "error: (.+): (patch does not apply|already exists in working directory)": GitError;
    "fatal: A branch named '(.+)' already exists.": GitError;
    "fatal: bad revision '(.*)'": GitError;
    "fatal: Not a git repository \\(or any of the parent directories\\): (.*)": GitError;
    "fatal: refusing to merge unrelated histories": GitError;
    "error: GH001: ": GitError;
    "error: GH002: ": GitError;
    "error: GH003: Sorry, force-pushing to (.+) is not allowed.": GitError;
    "error: GH005: Sorry, refs longer than (.+) bytes are not allowed": GitError;
    "error: GH006: Protected branch update failed for (.+)\nremote: error: At least one approved review is required": GitError;
    "error: GH006: Protected branch update failed for (.+)\nremote: error: Cannot force-push to a protected branch": GitError;
    "error: GH007: Your push would publish a private email address.": GitError;
};
/**
 * The error code for when git cannot be found. This most likely indicates a
 * problem with dugite itself.
 */
export declare const GitNotFoundErrorCode = "git-not-found-error";
/** The error code for when the path to a repository doesn't exist. */
export declare const RepositoryDoesNotExistErrorCode = "repository-does-not-exist-error";