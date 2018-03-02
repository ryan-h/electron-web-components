import { mixin, MixinConstructor } from "./mixin";
import { getFileUrl } from "../../helpers/utilities";
import * as path from "path";

const appStylesPath = path.join(__dirname, "..", "..", "styles");

/**
 * Dialog provides common functionality for a web component to represent a dialog element.
 *
 * The web component must include a dialog element in the shadow dom (template).
 */
export const Dialog = mixin(<T extends MixinConstructor<HTMLElement>>(base: T) => class extends base {
    /**
     * Defines the path to the common dialog style sheet.
     * Override to specify a custom path.
     *
     * @readonly
     * @protected
     */
    protected get dialogStyleSheetPath() {
        return `${appStylesPath}\\dialog.css`;
    }

    /**
     * Defines if the dialog can be cancelled by pressing escape.
     * Override to disallow canceling the dialog.
     * 
     * @readonly
     * @protected
     * @type {boolean}
     */
    protected get isCancelable(): boolean {
        return true;
    }

    /**
     * Gets the dialog element from the shadow DOM.
     *
     * @readonly
     * @protected
     * @type {HTMLDialogElement}
     */
    protected get dialog(): HTMLDialogElement {
        let dialog: HTMLDialogElement | null = null;

        if (this.shadowRoot) {
            dialog = this.shadowRoot.querySelector("dialog");
        }

        if (!dialog) {
            throw new Error("A dialog element was not found in the template for the web component.");
        }

        return dialog;
    }

    /**
     * Creates an instance of the Dialog mixin.
     *
     * @param args
     */
    constructor(...args) {
        super(...args);

        this._addDialogStyleSheet();

        this.dialog.addEventListener("cancel", e => this._onCancel(e));
    }

    /**
     * Opens the dialog box if it is not already open.
     *
     */
    public show() {
        if (!this.dialog.open) {
            this.dialog.showModal();
        }
    }

    /**
     * Closes the dialog box if it is open.
     *
     */
    public close() {
        if (this.dialog.open) {
            this.dialog.close();
        }
    }

    /**
     * Adds the dialog style sheet link element to the shadow dom.
     *
     * @private
     * @returns {void}
     */
    private _addDialogStyleSheet(): void {
        if (this.shadowRoot) {
            const style = document.createElement("link");
            style.rel = "stylesheet";
            style.href = getFileUrl(this.dialogStyleSheetPath);
            style.setAttribute("async", "");

            this.shadowRoot.insertBefore(style, this.shadowRoot.firstChild);
        }
    }

    /**
     * Handles the cancel event to explicitly call the close function, 
     * or if not cancelable, prevent the dialog from closing.
     * 
     * @private
     * @param {Event} event 
     * @returns {void} 
     */
    private _onCancel(event: Event): void {
        if (!this.isCancelable) {
            return event.preventDefault();
        }

        this.close();
    }
});
