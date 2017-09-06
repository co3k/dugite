import { IGitResult } from '../lib';
export declare const gitVersion = "2.14.1";
export declare const gitLfsVersion = "2.2.1";
export declare function initialize(repositoryName: string): Promise<string>;
export declare function verify(result: IGitResult, callback: (result: IGitResult) => void): void;
