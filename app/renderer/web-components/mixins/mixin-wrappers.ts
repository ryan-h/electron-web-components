// global symbol variables
const wrappedMixinSymbol = Symbol("_wrappedMixin");
const cachedApplicationsSymbol = Symbol("_cachedApplications");
const cachedMixinRefSymbol = Symbol("_cachedMixinRef");

/**
 * Wraps the mixin with another function, 
 * allowing the mixin to be decorated with additional functionality.
 * 
 * @export
 * @template T 
 * @param {T} mixin 
 * @param {*} wrapper 
 * @returns {T} 
 */
export function wrap<T>(mixin: T, wrapper: any): T {
    Object.setPrototypeOf(wrapper, mixin);

    // store the original mixin for unwrapping
    if (!mixin[wrappedMixinSymbol]) {
        mixin[wrappedMixinSymbol] = mixin;
    }

    return wrapper;
}

/**
 * Unwraps the mixin to return the original mixin when wrapped by one or more functions.
 * 
 * @export
 * @template T 
 * @param {T} wrappedMixin 
 * @returns {T} 
 */
export function unwrap<T>(wrappedMixin: T): T {
    return wrappedMixin[wrappedMixinSymbol] || wrappedMixin;
}

/**
 * Decorates the mixin so that the application of the mixin is cached for each base. When the mixin is applied
 * multiple times to the same base class, the mixin will only create one class expression, memoize it, and return it 
 * for each application.
 * 
 * @export
 * @template T 
 * @param {T} mixin 
 * @returns 
 */
export function cached<T>(mixin: T) {
    return wrap(mixin, (base) => {
        const cachedApplications = base.hasOwnProperty(cachedApplicationsSymbol)
            ? base[cachedApplicationsSymbol]
            : base[cachedApplicationsSymbol] = new Map<symbol, any>();

        let cachedMixinRef = mixin[cachedMixinRefSymbol];

        if (!cachedMixinRef) {
            cachedMixinRef = mixin[cachedMixinRefSymbol] = Symbol();
        }

        let application = cachedApplications.get(cachedMixinRef);

        if (!application) {
            application = (mixin as any)(base);
            cachedApplications.set(cachedMixinRef, application);
        }

        return application;
    });
}
