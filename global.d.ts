/**
 * Alias for Event so that it can be used in the Electron typings.
 */
type NodeEvent = Event;

/**
 * Additional Electron types not provided by the Electron package.
 */
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

    interface BrowserWindow {
        /**
         * Removes the menu bar.
         * 
         * @param {null} menu 
         * @memberof BrowserWindow
         */
        setMenu(menu: null): void;
    }
}
