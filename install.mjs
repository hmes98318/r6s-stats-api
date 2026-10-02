/** @fileoverview Install Chromium inside the resolved Playwright dependency. */
import {spawnSync} from 'node:child_process';
import {error as reportError} from 'node:console';
import {createRequire} from 'node:module';
import {dirname, join} from 'node:path';
import process from 'node:process';

if (process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD !== '1') {
    const require = createRequire(import.meta.url);
    const cli = join(dirname(require.resolve('playwright/package.json')), 'cli.js');
    const result = spawnSync(
        process.execPath,
        [cli, 'install', 'chromium', '--no-shell'],
        {
            env: {...process.env, PLAYWRIGHT_BROWSERS_PATH: '0'},
            stdio: 'inherit',
            windowsHide: true,
            timeout: 300_000,
        },
    );
    if (result.error) {
        reportError('Local Chromium installation failed:', result.error.message);
    }
    process.exitCode = result.status ?? 1;
}
