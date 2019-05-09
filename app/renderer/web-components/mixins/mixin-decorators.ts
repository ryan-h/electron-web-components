// global symbol variables
const wrappedMixinSymbol = Symbol("_wrappedMixin");
const appliedMixinSymbol = Symbol("_appliedMixin");
const cachedApplicationsSymbol = Symbol("_cachedApplications");
const cachedMixinRefSymbol = Symbol("_cachedMixinRef");

/**
 * Wraps the mixin with another function,
 * allowing the mixin to be decorated with additional functionality.
 *
 * @template T
 * @param {T} mixin
 * @param {*} wrapper
 * @returns {T}
 */
function wrap<T>(mixin: T, wrapper: any): T {
    Object.setPrototypeOf(wrapper, mixin as Object);

    // store the original mixin for unwrapping
    if (!mixin[wrappedMixinSymbol]) {
        mixin[wrappedMixinSymbol] = mixin;
    }

    return wrapper;
}

/**
 * Unwraps the mixin to return the original mixin when wrapped by one or more functions.
 *
 * @template T
 * @param {T} wrappedMixin
 * @returns {T}
 */
function unwrap<T>(wrappedMixin: T): T {
    return wrappedMixin[wrappedMixinSymbol] || wrappedMixin;
}

/**
 * Determines if a mixin has been applied to the instance of an object.
 *
 * @template T
 * @param {object} instance
 * @param {T} mixin
 * @returns {boolean}
 */
function hasMixin<T>(instance: object, mixin: T): boolean {
    let obj = instance;

    while (obj != null) {
        // check if the object is an application of the mixin
        if (obj.hasOwnProperty(appliedMixinSymbol) &&
            obj[appliedMixinSymbol] === unwrap(mixin)) {
            return true;
        }

        // continue down the prototype chain
        obj = Object.getPrototypeOf(obj);
    }

    return false;
}

/**
 * Decorates the mixin with core functionality required by other mixin decorators.
 *
 * @export
 * @template T
 * @param {T} mixin
 * @returns {T}
 */
export function core<T>(mixin: T): T {
    return wrap(mixin, base => {
        const application = (mixin as any)(base);

        // store a reference to the original mixin on the prototype of the mixin application,
        // this allows for determining what mixin has been applied to an object instance
        application.prototype[appliedMixinSymbol] = unwrap(mixin);

        return application;
    });
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
export function cached<T>(mixin: T): T {
    return wrap(mixin, base => {
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

/**
 * Decorates the mixin by adding a Symbol.hasInstance implementation
 * in order to support instanceof checks for a particular mixin.
 *
 * @export
 * @template T
 * @param {T} mixin
 * @returns {T}
 */
export function hasInstance<T>(mixin: T): T {
    Object.defineProperty(mixin, Symbol.hasInstance, {
        value(instance: object): boolean {
            return hasMixin(instance, mixin);
        }
    });

    return mixin;
}
