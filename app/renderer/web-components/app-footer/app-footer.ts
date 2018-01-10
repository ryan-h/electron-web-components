import { Shadow } from "../mixins";

export class AppFooter extends Shadow(HTMLElement) {
    /**
     * Specifies the style sheet files.
     * 
     * @readonly
     * @protected
     * @type {Array<string>}
     * @memberof AppFooter
     */
    protected get styleSheetPaths(): Array<string> {
        return [`${__dirname}\\app-footer.css`];
    }

    /**
     * Specifies the template file.
     * 
     * @readonly
     * @protected
     * @type {string}
     * @memberof AppFooter
     */
    protected get templatePath(): string {
        return `${__dirname}\\app-footer.html`;
    }
}

customElements.define("app-footer", AppFooter);
