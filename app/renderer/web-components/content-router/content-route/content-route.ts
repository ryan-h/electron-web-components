import * as path from "path";
import { convertHtmlFileToNode } from "../../../helpers/utilities";

const appViewsPath = path.join(__dirname, "..", "..", "..", "views");

export class ContentRoute extends HTMLElement {
    /**
     * Gets the view associated with the route.
     * 
     * @readonly
     * @type {string}
     * @memberof ContentRoute
     */
    public get view(): string {
        return this.getAttribute("view") || "";
    }

    /**
     * Gets the template content.
     * The content is cloned to prevent modifications to the original.
     * 
     * @readonly
     * 
     * @memberof ContentRoute
     */
    public get content(): Node {
        const template = this.querySelector("template");

        if (!template) {
            throw new Error("Unable to find the content template for the route.");
        }

        return template.content.cloneNode(true);
    }

    /**
     * Creates an instance of ContentRoute.
     * 
     * @memberof ContentRoute
     */
    constructor() {
        super();

        const routePath = `${path.join(appViewsPath, this.view)}.html`;

        const template = document.createElement("template");
        template.content.appendChild(convertHtmlFileToNode(routePath));

        // store the view content in a template in the light DOM
        this.appendChild(template);
    }
}

customElements.define("content-route", ContentRoute);
