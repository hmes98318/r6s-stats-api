import {R6StatsError} from './errors.ts';

/** Scalar metric units after normalization. */
export type MetricUnit = 'number' | 'percent' | 'seconds' | 'text';

/** A source metric with a normalized value and its original display text. */
export interface Metric {
    value: number | string | boolean | null;
    displayName: string | null;
    displayValue: string | null;
    unit: MetricUnit;
    percentile: number | null;
}

/** Validate an untrusted JSON record before inspecting its properties. */
export function record(value: unknown, label: string): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new R6StatsError(
            'PARSE_ERROR',
            `Expected ${label} to be an object.`,
        );
    }
    return value as Record<string, unknown>;
}

/** Read optional source metadata without treating absence as a fake value. */
export function optionalRecord(value: unknown): Record<string, unknown> {
    return value === null || value === undefined
        ? {}
        : record(value, 'metadata');
}

/** Validate a source list rather than silently discarding malformed entries. */
export function list(value: unknown, label: string): unknown[] {
    if (!Array.isArray(value)) {
        throw new R6StatsError(
            'PARSE_ERROR',
            `Expected ${label} to be an array.`,
        );
    }
    return value;
}

/** Return a nonempty source string or an explicit missing value. */
export function text(value: unknown): string | null {
    return typeof value === 'string' && value.trim() ? value.trim() : null;
}

/** Clean en-US grouped numbers and percentages without converting blanks to 0. */
export function number(value: unknown): number | null {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    }
    if (typeof value !== 'string') {
        return null;
    }
    const trimmed = value.trim();
    if (!/^[+-]?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?%?$/.test(trimmed)) {
        return null;
    }
    const result = Number(trimmed.replaceAll(',', '').replace(/%$/, ''));
    return Number.isFinite(result) ? result : null;
}

/** Parse a displayed duration when the source omits its numeric value. */
export function durationSeconds(value: unknown): number | null {
    const numeric = number(value);
    if (numeric !== null) {
        return numeric;
    }
    const displayed = text(value)?.replaceAll(',', '');
    if (!displayed || !/^(?:\d+(?:\.\d+)?[dhms]\s*)+$/.test(displayed)) {
        return null;
    }
    const units: Record<string, number> = {d: 86_400, h: 3600, m: 60, s: 1};
    let seconds = 0;
    for (const match of displayed.matchAll(/(\d+(?:\.\d+)?)([dhms])/g)) {
        seconds += Number(match[1]) * (units[match[2] ?? ''] ?? 0);
    }
    return Number.isFinite(seconds) ? seconds : null;
}

/** Normalize valid source dates, excluding the upstream expiry sentinel. */
export function timestamp(value: unknown): string | null {
    const source = text(value);
    if (!source || source.startsWith('0001-')) {
        return null;
    }
    const date = new Date(source);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/** Normalize one metric while preserving nulls and the source's units. */
export function normalizeMetric(value: unknown): Metric {
    const source = record(value, 'metric');
    const displayType = text(source.displayType) ?? '';
    const raw = source.value === undefined ? source.displayValue : source.value;
    let normalized: Metric['value'];
    let unit: MetricUnit = 'number';
    if (displayType.startsWith('Time')) {
        unit = 'seconds';
        const numeric = number(raw);
        normalized =
            numeric === null
                ? durationSeconds(raw)
                : numeric / (displayType === 'TimeMilliseconds' ? 1000 : 1);
    } else if (displayType.includes('Percentage')) {
        unit = 'percent';
        const numeric = number(raw);
        normalized =
            numeric !== null && numeric >= 0 && numeric <= 100 ? numeric : null;
    } else if (displayType === 'String' || typeof raw === 'boolean') {
        unit = 'text';
        normalized = typeof raw === 'boolean' ? raw : text(raw);
    } else {
        normalized = number(raw);
    }
    return {
        value: normalized,
        displayName: text(source.displayName),
        displayValue: text(source.displayValue),
        unit,
        percentile: number(source.percentile),
    };
}

/** Normalize all source metrics without exposing their mutable raw objects. */
export function normalizeMetrics(value: unknown): Record<string, Metric> {
    const source = record(value, 'statistics');
    return Object.fromEntries(
        Object.entries(source).map(([key, metric]) => [
            key,
            normalizeMetric(metric),
        ]),
    );
}

/** Read an envelope and report source errors before domain parsing. */
export function unwrap(value: unknown): unknown {
    const source = record(value, 'Tracker response');
    if (source.errors !== undefined) {
        const errors = list(source.errors, 'errors');
        if (errors.length > 0) {
            const first = record(errors[0], 'error');
            const code = text(first.code)?.toLowerCase() ?? '';
            throw new R6StatsError(
                code.includes('notfound') || code.includes('not_found')
                    ? 'PLAYER_NOT_FOUND'
                    : 'UPSTREAM_ERROR',
                'Tracker returned an error for the requested resource.',
            );
        }
    }
    if (source.data === undefined || source.data === null) {
        throw new R6StatsError('PARSE_ERROR', 'Tracker did not return data.');
    }
    return source.data;
}
