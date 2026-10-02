import {R6StatsError} from './errors.ts';
import {PLAYLISTS} from './parsers.ts';
import type {Platform, Playlist} from './types.ts';

/** Validate an account platform at the JavaScript boundary. */
export function validatePlatform(value: Platform): Platform {
    if (value !== 'ubi' && value !== 'psn' && value !== 'xbl') {
        throw new R6StatsError(
            'INVALID_ARGUMENT',
            'Platform must be ubi, psn or xbl.',
        );
    }
    return value;
}

/** Validate and trim a public identifier without restricting console spaces. */
export function validateName(value: string, label = 'Username'): string {
    if (
        typeof value !== 'string' ||
        !value.trim() ||
        value.length > 128 ||
        value.trim() === '.' ||
        value.trim() === '..' ||
        Array.from(value).some(character => {
            const code = character.codePointAt(0) ?? 0;
            return code < 32 || code === 127;
        })
    ) {
        throw new R6StatsError(
            'INVALID_ARGUMENT',
            `${label} must be a nonempty public identifier of at most 128 characters.`,
        );
    }
    return value.trim();
}

/** Reject unknown public playlist options before any network request. */
export function validatePlaylist(value: Playlist): Playlist {
    if (!Object.hasOwn(PLAYLISTS, value)) {
        throw new R6StatsError('INVALID_ARGUMENT', 'Unsupported playlist.');
    }
    return value;
}

/** Bound numeric options, including arguments supplied by JavaScript callers. */
export function validateInteger(
    value: number,
    label: string,
    maximum: number,
    minimum = 0,
): number {
    if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
        throw new R6StatsError(
            'INVALID_ARGUMENT',
            `${label} must be an integer between ${minimum} and ${maximum}.`,
        );
    }
    return value;
}
