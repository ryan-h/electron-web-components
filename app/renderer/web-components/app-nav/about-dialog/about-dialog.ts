import { Shadow, Dialog } from "../../mixins";

export class AboutDialog extends Dialog(Shadow(HTMLElement)) {
    /**
     * Specifies the template file.
     * 
     * @readonly
     * @protected
     * @type {string}
     * @memberof AboutDialog
     */
    protected get templatePath(): string {
        return `${__dirname}\\about-dialog.html`;
    }

    /**
     * Gets the close button from the shadow dom.
     * 
     * @readonly
     * @protected
     * @type {HTMLButtonElement}
     * @memberof AboutDialog
     */
    protected get closeButton(): HTMLButtonElement {
        const btn: HTMLButtonElement | null = this.shadowRoot.querySelector("#closeButton");

        if (!btn) {
            throw new Error("The close button was not found in the template.");
        }

        return btn;
    }

    /**
     * Creates an instance of AboutDialog.
     * 
     * @memberof AboutDialog
     */
    constructor() {
        super();

        this.closeButton.addEventListener("click", () => this._onCloseClick());
    }

    /**
     * Handles when the close button is clicked.
     * 
     * @private
     * @memberof AboutDialog
     */
    private _onCloseClick(): void {
        this.close();
    }
}

customElements.define("about-dialog", AboutDialog);
