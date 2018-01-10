import { mixin, MixinConstructor } from "./mixin";
import * as camelCase from "camelcase";

// Stores the attribute property names so the conversion only has to occur once
const attributePropertyNames = new Map<string, string>();

/**
 * AttributeMarshaling adds functionality to have the value of a changed attribute marshaled to a property on the web component.
 * 
 * The connectedCallback and disconnectedCallback methods in the web component will need to be used to control this functionality. For Example:
 * 
 * protected connectedCallback() {
 *     super.connectAttributeMarshaling();
 * }
 * 
 * protected disconnectedCallback() {
 *     super.disconnectAttributeMarshaling();
 * }
 * 
 * Once this is connected, any camel-case property on the component matching the attribute name will have it's value set when changed.
 * An example usage could be to have a getter and setter with a backing field:
 * 
 * <my-component my-attribute="test"></my-component>
 * 
 * private _myAttribute: string | null;
 * 
 * protected get myAttribute() {
 *    return this._myAttribute;
 * }
 * 
 * protected set myAttribute(value: string | null) {
 *    this._myAttribute = value;
 * }
 * 
 * Another example could be just using the set method to perform additional functionality when the attribute is changed:
 * 
 * protected set myAttribute(value: string | null) {
 *     if (value === "change") {
 *         this.childElement.change();
 *     }
 * }
 * 
 * By default any attribute matching a property will have the changed value marshaled. To instead define a specific list of attributes to
 * observe, override the marshaledAttributes getter and define the attribute names:
 * 
 * protected get marshaledAttributes() {
 *     return ["my-attribute"];
 * }
 * 
 * Note: This only supports string values, if any type conversion is required just use the attributeChangedCallback for that attribute.
 * Also, the attributeChangedCallback will occur prior to the attribute marshaling, so a marshaled property will not be updated yet at that time.
 */
export const AttributeMarshaling = mixin(<T extends MixinConstructor<HTMLElement>>(base: T) => class extends base {
    /**
     * The instance of the mutation observer.
     * 
     * @private
     * @type {MutationObserver}
     */
    private _observer: MutationObserver;

    /**
     * Override to define the specific attribute names to marshal to properties.
     * By default, any attribute that maps to an existing property will be marshaled.
     * 
     * @readonly
     * @protected
     * @type {(Array<string> | null)}
     */
    protected get marshaledAttributes(): Array<string> | null {
        return null;
    }

    /**
     * Creates an instance of the AttributeMarshaling mixin.
     * 
     * @param args 
     */
    constructor(...args) {
        super(...args);

        this._observer = new MutationObserver(mutations => this._handleMutations(mutations));
    }

    /**
     * Start attribute marshaling and the observation of attribute mutations.
     * 
     * @protected
     */
    protected connectAttributeMarshaling(): void {
        // only observe attribute mutations
        this._observer.observe(this, {
            attributes: true,
            attributeFilter: this.marshaledAttributes ? this.marshaledAttributes : undefined
        });

        // set all the initial attribute values to the related properties
        for (let i = 0, length = this.attributes.length; i < length; i++) {
            const attribute = this.attributes.item(i);

            // if specific attributes where supplied, ensure that the changed attribute is in that list
            if (this.marshaledAttributes && this.marshaledAttributes.indexOf(attribute.name) < 0) {
                continue;
            }

            this._setAttributeProperty(attribute.name, attribute.value);
        }
    }

    /**
     * Stop attribute marshaling and the observation of attribute mutations.
     * 
     * @protected
     */
    protected disconnectAttributeMarshaling(): void {
        this._observer.disconnect();
    }

    /**
     * Handles the mutation callback in order to set the related property based 
     * on the new attribute value.
     * 
     * @private
     * @param {MutationRecord[]} mutations 
     */
    private _handleMutations(mutations: MutationRecord[]): void {
        mutations.forEach(mutation => {
            if (mutation.type === "attributes" && mutation.attributeName) {
                const attributeValue = this.getAttribute(mutation.attributeName);

                this._setAttributeProperty(mutation.attributeName, attributeValue);
            }
        });
    }

    /**
     * Sets a single attribute value to a related property.
     * 
     * @private
     * @param {string} attributeName 
     * @param {(string | null)} attributeValue 
     */
    private _setAttributeProperty(attributeName: string, attributeValue: string | null): void {
        let propertyName = attributePropertyNames.get(attributeName);

        if (!propertyName) {
            // if not already converted, convert the property name and store it in the map
            propertyName = camelCase(attributeName);
            attributePropertyNames.set(attributeName, propertyName);
        }

        // get the property on the web component, excluding the base prototype
        const property = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), propertyName);

        // ensure that the property exists and that it actually has a setter, currently only a 
        // setter property is supported, this will need to be updated if we want to support "fields"
        if (property && property.set) {
            property.set.call(this, attributeValue);
        }
    }
});
