/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ascents from "../ascents.js";
import type * as auth from "../auth.js";
import type * as diagnostics from "../diagnostics.js";
import type * as fingerprint from "../fingerprint.js";
import type * as imports from "../imports.js";
import type * as log from "../log.js";
import type * as maintenance from "../maintenance.js";
import type * as migrations from "../migrations.js";
import type * as operations from "../operations.js";
import type * as training from "../training.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ascents: typeof ascents;
  auth: typeof auth;
  diagnostics: typeof diagnostics;
  fingerprint: typeof fingerprint;
  imports: typeof imports;
  log: typeof log;
  maintenance: typeof maintenance;
  migrations: typeof migrations;
  operations: typeof operations;
  training: typeof training;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
