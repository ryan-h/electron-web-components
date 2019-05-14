import { mixin, MixinConstructor } from "./mixin";
import { getFileUrl, convertHtmlFileToNode } from "../../helpers/utilities";
import * as path from "path";

const appStylesPath = path.join(__dirname, "..", "..", "styles");

/**
 * Shadow will attach the shadow dom to the web component and provide functionality for global styles,
 * and is also responsible for adding any custom template content or stylesheets to the shadow DOM.
 *
 * Add a custom stylesheet:
 *
 * protected get styleSheetPaths(): Array<string> {
 *    return [`${__dirname}\\my-component.css`];
 * }
 *
 * Add a custom template:
 *
 * protected get templatePath(): string {
 *    return `${__dirname}\\my-component.html`;
 * }
 */
export const Shadow = mixin(<T extends MixinConstructor<HTMLElement>>(base: T) => class extends base {
    /**
     * Defines the path to the global style sheet.
     * Override to specify a custom path.
     *
     * @readonly
     * @protected
     */
    protected get globalStyleSheetPath() {
        return `${appStylesPath}\\global.css`;
    }

    /**
     * Determines if the global style sheet should be added.
     * Override in order to disable adding the global style sheet.
     *
     * @readonly
     * @protected
     */
    protected get shouldAddGlobalStyleSheet() {
        return true;
    }

    /**
     * Override to specify the list of paths for the style sheets.
     *
     * @readonly
     * @protected
     * @type {Array<string>}
     */
    protected get styleSheetPaths(): Array<string> {
        return [];
    }

    /**
     * Override to specify the path to the template file.
     *
     * @readonly
     * @protected
     * @type {string}
     */
    protected get templatePath(): string {
        return "";
    }

    /**
     * Gets the shadow root for the web component.
     *
     * @readonly
     * @type {ShadowRoot}
     * @throws Error - if shadow root does not exist
     */
    public get shadowRoot(): ShadowRoot {
        const shadowRoot = super.shadowRoot;

        if (!shadowRoot) {
            throw new Error("Shadow Root does not exist on this component.");
        }

        return shadowRoot;
    }

    /**
     * Creates an instance of the Shadow mixin.
     *
     * @param args
     */
    constructor(...args) {
        super(...args);

        this.attachShadow({ mode: "open" });

        if (this.templatePath) {
            // only create the overlay if there are stylesheets
            if (this.shouldAddGlobalStyleSheet || this.styleSheetPaths.length > 0) {
                const contentOverlay = this._createContentOverlay();

                // an overlay is currently the best way to temporarily hide content while loading external stylesheets:
                // - an attribute cannot exist on the web-component when constructed programmatically (customElements.get())
                // - The content must be visible to apply some DOM manipulations (ie, focus, etc)
                this.shadowRoot.appendChild(contentOverlay);

                // wait for all the stylesheets to load before showing content (prevents FOUC)
                this.addStyleSheets().then(() => contentOverlay.remove());
            }

            this.shadowRoot.appendChild(convertHtmlFileToNode(this.templatePath));
        } else {
            this.addStyleSheets();
        }
    }

    /**
     * Adds all the external stylesheets to the shadow DOM.
     *
     * @protected
     * @returns {Promise<void>}
     */
    protected async addStyleSheets(): Promise<void> {
        const styleSheetPaths = this.shouldAddGlobalStyleSheet
            ? [...this.styleSheetPaths, this.globalStyleSheetPath]
            : this.styleSheetPaths;

        for (const styleSheetPath of styleSheetPaths) {
            if (styleSheetPath) {
                const sheet = new CSSStyleSheet();

                await sheet.replace(`@import url("${getFileUrl(styleSheetPath)}")`);

                this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, sheet];
            }
        }
    }

    /**
     * Creates the HTML element to be used as an overlay to hide the content until all stylesheets are loaded.
     *
     * @private
     * @returns {HTMLElement}
     */
    private _createContentOverlay(): HTMLElement {
        const overlay = document.createElement("div");
        overlay.style.position = "absolute";
        overlay.style.top = "0";
        overlay.style.right = "0";
        overlay.style.bottom = "0";
        overlay.style.left = "0";
        overlay.style.zIndex = "10000";
        overlay.style.backgroundColor = "#f5f6f6";

        return overlay;
    }
});
