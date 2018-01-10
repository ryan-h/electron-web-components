import { RendererEventBus } from "../../../services";
import { MainEvents } from "../../../../main/services";
import { Shadow, AttributeMarshaling } from "../../mixins";

export class AppNavItem extends AttributeMarshaling(Shadow(HTMLElement)) {
    /**
     * The value set to the route-view attribute.
     * 
     * @private
     * @type {(string | null)}
     * @memberof AppNavItem
     */
    private _routeView: string | null;

    /**
     * Specifies the style sheet files.
     * 
     * @readonly
     * @protected
     * @type {Array<string>}
     * @memberof AppNavItem
     */
    protected get styleSheetPaths(): Array<string> {
        return [`${__dirname}\\app-nav-item.css`];
    }

    /**
     * Specifies the template file.
     * 
     * @readonly
     * @protected
     * @type {string}
     * @memberof AppNavItem
     */
    protected get templatePath(): string {
        return `${__dirname}\\app-nav-item.html`;
    }

    /**
     * Get the specific marshaled attributes.
     * 
     * @readonly
     * @protected
     * @type {Array<string>}
     * @memberof AppNavItem
     */
    protected get marshaledAttributes(): Array<string> {
        return ["activated", "route-view"];
    }

    /**
     * Sets the value for the route-view attribute.
     * 
     * @protected
     * @memberof AppNavItem
     */
    protected set routeView(value: string | null) {
        this._routeView = value;
    }

    /**
     * Sets the value for the activated attribute.
     * 
     * @protected
     * @memberof AppNavItem
     */
    protected set activated(value: string | null) {
        const link = this.shadowRoot.querySelector("a");

        if (link) {
            value !== null
                ? link.classList.add("activated")
                : link.classList.remove("activated");
        }
    }

    /**
     * Creates an instance of AppNavItem.
     * 
     * @memberof AppNavItem
     */
    constructor() {
        super();

        this.addEventListener("click", e => this._onClick(e));
    }

    /**
     * Handles connecting events when the element is added to the dom.
     * 
     * @protected
     * 
     * @memberof AppNavItem
     */
    protected connectedCallback() {
        this.connectAttributeMarshaling();
    }

    /**
     * Handles disconnecting events when the element is removed from the dom.
     * 
     * @protected
     * 
     * @memberof AppNavItem
     */
    protected disconnectedCallback() {
        this.disconnectAttributeMarshaling();
    }

    /**
     * Handles when the item is clicked by sending the event to route the application.
     * 
     * @private
     * @param {MouseEvent} event 
     * @memberof AppNavItem
     */
    private _onClick(event: MouseEvent) {
        if (this._routeView) {
            RendererEventBus.send(MainEvents.Route, this._routeView);
        }
    }
}

customElements.define("app-nav-item", AppNavItem);
