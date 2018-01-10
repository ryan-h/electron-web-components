import { cached } from "./mixin-decorators";

/**
 * The constructor type for mixins.
 */
export type MixinConstructor<T extends HTMLElement> = new (...args: any[]) => T;

/**
 * The function decorator for all mixins which wraps with common functionality.
 * 
 * @export
 * @template T 
 * @param {T} mixin 
 * @returns 
 */
export function mixin<T>(mixin: T) {
    return cached(mixin);
}
