// Additional Electron types not provided by the Electron package.

declare namespace Electron {
    type IpcMainEventListener = (event: IpcMainEvent, ...args: any[]) => void;

    interface IpcMainEvent {
		/**
		 * Set this to the value to be returned in a synchronous message.
		 */
        returnValue?: any;
		/**
		 * Returns the webContents that sent the message, you can call sender.send
		 * to reply to the asynchronous message.
		 */
        sender: WebContents;
    }

    type IpcRendererEventListener = (event: IpcRendererEvent, ...args: any[]) => void;

    interface IpcRendererEvent {
		/**
		 * You can call sender.send to reply to the asynchronous message.
		 */
        sender: IpcRenderer;
    }
}


// Additional DOM types not provided by TypeScript.

declare interface ShadowRoot {
    /**
     * The defined styles for the DOM element.
     *
     * @type {ReadonlyArray<CSSStyleSheet>}
     * @memberof ShadowRoot
     */
    adoptedStyleSheets: ReadonlyArray<CSSStyleSheet>;
}

declare interface CSSStyleSheet {
    /**
     * Update the rules for a stylesheet.
     *
     * @param {string} text
     * @memberof CSSStyleSheet
     */
    replaceSync(text: string): void;

    /**
     * Update the rules for a stylesheet, including imports.
     * Returns a Promise that resolves once any external references are loaded.
     *
     * @param {string} text
     * @returns {Promise<CSSStyleSheet>}
     * @memberof CSSStyleSheet
     */
    replace(text: string): Promise<CSSStyleSheet>;
}
