import { mixin, MixinConstructor } from "./mixin";

/**
 * ChildrenUpgraded provides functionality to be able to delay work until all child elements are upgraded.
 * The callback can be used in place of the constructor, to ensure that any web component is defined in 
 * the shadow DOM before being used.
 * 
 * Override the method and perform work:
 * 
 * protected childrenUpgradedCallback() {
 *     this.myWebComponent.someMethod();
 * }
 */
export const ChildrenUpgraded = mixin(<T extends MixinConstructor<HTMLElement>>(base: T) => class extends base {
    /**
     * Creates an instance of the ChildrenUpgraded mixin.
     * 
     * @param args
     */
    constructor(...args) {
        super(...args);

        if (this.shadowRoot) {
            this._ensureChildElementsUpgraded(this.shadowRoot).then(this.childrenUpgradedCallback.bind(this));
        }
    }

    /**
     * Override this method to perform any work that needs 
     * to be delayed until after child elements are upgraded.
     * 
     * @protected
     */
    protected childrenUpgradedCallback() {}

    /**
     * Ensures that all child elements have been upgraded.
     * This can be used to delay work until the promise is
     * resolved and all child web components are then defined.
     * 
     * @private
     * @param {(ShadowRoot | Element)} parent 
     * @returns {Promise<void>} 
     */
    private async _ensureChildElementsUpgraded(parent: ShadowRoot | Element): Promise<void> {
        const elements = parent.querySelectorAll(":not(:defined)");

        if (elements.length > 0) {
            const promises = Array.prototype.map.call(elements, (element: Element) => {
                return element.localName
                    ? customElements.whenDefined(element.localName)
                    : Promise.resolve();
            });

            await Promise.all(promises);
        }
    }
});
