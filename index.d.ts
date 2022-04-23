// Type definitions for ./index.js

import {StatsGeneral} from './types/general';
import {StatsCasual} from './types/casual';
import {StatsRank} from './types/rank';
import {StatsUnrank} from './types/unrank';
import {StatsDeathmatch} from './types/deathmatch';
import {StatsOperator} from './types/operator';


/**
 * Fetch General stats.
 * @param {string} platform: "pc" | "xbox" | "psn".
 * @param {string} name: Player name.
 * @returns Stats | "FORMAT_ERROR" | "NOT_FOUND"
 * @typedef "FORMAT_ERROR": Input format error.
 * @typedef "PLATFORM_ERROR": Input platform error.
 * @typedef "NOT_FOUND": No stats found or any errors.
 */
async function general(platform: string, name: string): Promise<StatsGeneral | "FORMAT_ERROR" | "NOT_FOUND">

/**
 * Fetch Casual stats.
 * @param {string} platform: "pc" | "xbox" | "psn".
 * @param {string} name: Player name.
 * @returns Stats | "FORMAT_ERROR" | "NOT_FOUND"
 * @typedef "FORMAT_ERROR": Input format error.
 * @typedef "PLATFORM_ERROR": Input platform error.
 * @typedef "NOT_FOUND": No stats found or any errors.
 */
declare async function casual(platform: string, name: string): Promise<StatsCasual | "FORMAT_ERROR" | "NOT_FOUND">

/**
 * Fetch Rank stats.
 * @param {string} platform: "pc" | "xbox" | "psn".
 * @param {string} name: Player name.
 * @returns Stats | "FORMAT_ERROR" | "NOT_FOUND"
 * @typedef "FORMAT_ERROR": Input format error.
 * @typedef "PLATFORM_ERROR": Input platform error.
 * @typedef "NOT_FOUND": No stats found or any errors.
 */
declare async function rank(platform: string, name: string): Promise<StatsRank | "FORMAT_ERROR" | "NOT_FOUND">

/**
 * Fetch Unrank stats.
 * @param {string} platform: "pc" | "xbox" | "psn".
 * @param {string} name: Player name.
 * @returns Stats | "FORMAT_ERROR" | "NOT_FOUND"
 * @typedef "FORMAT_ERROR": Input format error.
 * @typedef "PLATFORM_ERROR": Input platform error.
 * @typedef "NOT_FOUND": No stats found or any errors.
 */
declare async function unrank(platform: string, name: string): Promise<StatsUnrank | "FORMAT_ERROR" | "NOT_FOUND">

/**
 * Fetch Deathmatch stats.
 * @param {string} platform: "pc" | "xbox" | "psn".
 * @param {string} name: Player name.
 * @returns Stats | "FORMAT_ERROR" | "NOT_FOUND"
 * @typedef "FORMAT_ERROR": Input format error.
 * @typedef "PLATFORM_ERROR": Input platform error.
 * @typedef "NOT_FOUND": No stats found or any errors.
 */
declare async function deathmatch(platform: string, name: string): Promise<StatsDeathmatch | "FORMAT_ERROR" | "NOT_FOUND">

/**
 * Fetch Operators stats.
 * @param {string} platform: "pc" | "xbox" | "psn".
 * @param {string} name: Player name.
 * @returns Stats | "FORMAT_ERROR" | "NOT_FOUND"
 * @typedef "FORMAT_ERROR": Input format error.
 * @typedef "PLATFORM_ERROR": Input platform error.
 * @typedef "NOT_FOUND": No stats found or any errors.
 */
declare async function operator(platform: string, name: string, operator: string): Promise<StatsOperator | "FORMAT_ERROR" | "NOT_FOUND">


export {general, casual, rank, unrank, deathmatch, operator };