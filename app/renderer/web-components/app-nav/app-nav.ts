import { RendererEventBus, RendererEvents } from "../../services";
import { Shadow } from "../mixins";

export class AppNav extends Shadow(HTMLElement) {
    /**
     * Specifies the style sheet files.
     * 
     * @readonly
     * @protected
     * @type {Array<string>}
     * @memberof AppNav
     */
    protected get styleSheetPaths(): Array<string> {
        return [`${__dirname}\\app-nav.css`];
    }

    /**
     * Specifies the template file.
     * 
     * @readonly
     * @protected
     * @type {string}
     * @memberof AppNav
     */
    protected get templatePath(): string {
        return `${__dirname}\\app-nav.html`;
    }

    /**
     * Creates an instance of AppNav.
     * 
     * @memberof AppNav
     */
    constructor() {
        super();

        this._onRouteChanged = this._onRouteChanged.bind(this);
    }

    /**
     * Handles adding the event listener for Route Changed.
     * 
     * 
     * @memberof AppNav
     */
    public connectedCallback() {
        RendererEventBus.on(RendererEvents.RouteChanged, this._onRouteChanged);
    }

    /**
     * Handles removing the event listener for Route Changed.
     * 
     * 
     * @memberof AppNav
     */
    public disconnectedCallback() {
        RendererEventBus.removeListener(RendererEvents.RouteChanged, this._onRouteChanged);
    }

    /**
     * Handles when a route has changed by activating the related item.
     * 
     * @private
     * @param {(Electron.IpcRendererEvent | null)} event 
     * @param {(string | undefined)} view 
     * @memberof AppNav
     */
    private _onRouteChanged(event: Electron.IpcRendererEvent | null, view: string | undefined) {
        if (view) {
            this._activateItem(view);
        }
    }

    /**
     * Activates the item related with the view.
     * 
     * @private
     * @param {string} view
     * @memberof AppNav
     */
    private _activateItem(view: string): void {
        const items = this.shadowRoot.querySelectorAll("app-nav-item");

        items.forEach(item => {
            item.getAttribute("route-view") === view
                ? item.setAttribute("activated", "")
                : item.removeAttribute("activated");
        });
    }
}

customElements.define("app-nav", AppNav);
