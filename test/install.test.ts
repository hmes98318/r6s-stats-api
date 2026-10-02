/** @fileoverview Exercise npm installation with a fabricated CLI process. */
import assert from 'node:assert/strict';
import type {SpawnSyncOptions} from 'node:child_process';
import {mock, test} from 'node:test';

const install = mock.fn((
    executable: string,
    args: string[],
    options: SpawnSyncOptions,
): {status: number} => {
    assert.equal(executable, process.execPath);
    assert.deepEqual(args.slice(1), ['install', 'chromium', '--no-shell']);
    assert.equal(options.env?.PLAYWRIGHT_BROWSERS_PATH, '0');
    assert.equal(options.windowsHide, true);
    return {status: 0};
});
mock.module('node:child_process', {exports: {spawnSync: install}});

void test('npm lifecycle installs locally and permits explicit download skipping', async () => {
    const previousSkip = process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD;
    const previousExitCode = process.exitCode;
    try {
        delete process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD;
        await import(new URL('../install.mjs?install', import.meta.url).href);
        assert.equal(install.mock.callCount(), 1);
        assert.equal(process.exitCode, 0);

        process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = '1';
        await import(new URL('../install.mjs?skip', import.meta.url).href);
        assert.equal(install.mock.callCount(), 1);
    } finally {
        process.exitCode = previousExitCode;
        if (previousSkip === undefined) {
            delete process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD;
        } else {
            process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = previousSkip;
        }
    }
});
