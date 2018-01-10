import { RendererEventBus, RendererEvents } from "../../services";
import { Shadow } from "../mixins";
import { ContentRoute } from "./content-route";
import { removeChildren } from "../../helpers/utilities";

export class ContentRouter extends Shadow(HTMLElement) {
    /**
     * Stores the view name for the current route.
     * 
     * @private
     * @type {(string | undefined)}
     * @memberof ContentRouter
     */
    private _currentView: string | undefined;

    /**
     * Specifies the template file.
     * 
     * @readonly
     * @protected
     * @type {string}
     * @memberof ContentRouter
     */
    protected get templatePath(): string {
        return `${__dirname}\\content-router.html`;
    }

    /**
    * Gets the app container used for the route's view content.
    * 
    * @readonly
    * @protected
    * 
    * @memberof ContentRouter
    */
    protected get contentContainer() {
        const container = this.shadowRoot.getElementById("contentContainer");

        if (!container) {
            throw new Error("The content container was not found in the template file for the content-router component.");
        }

        return container as Element;
    }

    /**
     * Creates an instance of ContentRouter.
     * 
     * @memberof ContentRouter
     */
    constructor() {
        super();

        // creates a bound function variable that can be used for removing the event listener
        this._onRouteChanged = this._onRouteChanged.bind(this);
    }

    /**
     * Handles adding the event listener for Route.
     * 
     * 
     * @memberof ContentRouter
     */
    public connectedCallback() {
        RendererEventBus.on(RendererEvents.RouteChanged, this._onRouteChanged);
    }

    /**
     * Handles removing the event listener for Route.
     * 
     * 
     * @memberof ContentRouter
     */
    public disconnectedCallback() {
        RendererEventBus.removeListener(RendererEvents.RouteChanged, this._onRouteChanged);
    }

    /**
     * Handles the route changed event and loads the requested view.
     * 
     * @private
     * @param {(Electron.IpcRendererEvent | null)} event 
     * @param {(string | undefined)} view 
     * 
     * @memberof ContentRouter
     */
    private _onRouteChanged(event: Electron.IpcRendererEvent | null, view: string | undefined) {
        const routes = this.getElementsByTagName("content-route") as NodeListOf<ContentRoute>;

        if (routes.length > 0) {
            const selectedView = (view || "").trim().toLowerCase();

            for (const route of routes) {
                // only change the route if a view is found and it's not the current one
                if (route.view === selectedView && selectedView !== this._currentView) {
                    this._currentView = view;
                    this._loadNewRoute(route);
                    break;
                }
            }
        }
    }

    /**
     * Loads the new route content.
     * 
     * @private
     * @param {ContentRoute} newRoute 
     * 
     * @memberof ContentRouter
     */
    private _loadNewRoute(newRoute: ContentRoute): void {
        const container = this.contentContainer;

        // remove any previous view content
        removeChildren(container);

        // add the new view content
        container.appendChild(newRoute.content);
    }
}

customElements.define("content-router", ContentRouter);
