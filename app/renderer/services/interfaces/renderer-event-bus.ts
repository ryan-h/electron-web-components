import { RendererEvents } from "../";
import { MainEvents } from "../../../main/services";

export interface IRendererEventBus {
    /**
     * Adds an event listener to the event.
     * 
     * @param {RendererEvents} event
     * @param {Electron.IpcRendererEventListener} listener
     * @returns {this}
     * 
     * @memberof IRendererEventBus
     */
    on(event: RendererEvents, listener: Electron.IpcRendererEventListener): this;
    /**
     * Adds a single use event listener to an event.
     * 
     * @param {RendererEvents} event
     * @param {Electron.IpcRendererEventListener} listener
     * @returns {this}
     * 
     * @memberof IRendererEventBus
     */
    once(event: RendererEvents, listener: Electron.IpcRendererEventListener): this;
    /**
     * Remove a single listener from the event bus.
     * 
     * @param {RendererEvents} event
     * @param {Electron.IpcRendererEventListener} listener
     * @returns {this}
     * 
     * @memberof IRendererEventBus
     */
    removeListener(event: RendererEvents, listener: Electron.IpcRendererEventListener): this;
    /**
     * Remove all listeners for the given event.
     * 
     * @param {RendererEvents} [event]
     * @returns {this}
     * 
     * @memberof IRendererEventBus
     */
    removeAllListeners(event?: RendererEvents): this;
    /**
     * Send ...args to main via event in asynchronous message, the main
     * process can handle it by listening to the event on the MainEventBus.
     * 
     * @param {MainEvents} event
     * @param {...any[]} args
     * 
     * @memberof IRendererEventBus
     */
    send(event: MainEvents, ...args: any[]): void;
    /**
     * Send ...args to main via event in synchronous message, and returns
	 * the result sent from main process. The main process can handle it by listening
	 * to the event on the MainEventBus, and returns by setting event.returnValue.
	 * Note: Usually developers should never use this API, since sending synchronous
	 * message would block the whole renderer process.
     * 
     * @param {MainEvents} event
     * @param {...any[]} args
     * @returns {*} The result sent from the main process.
     * 
     * @memberof IRendererEventBus
     */
    sendSync(event: MainEvents, ...args: any[]): any;
    /**
     * Emits the event to any listeners on the renderer process. Passing along any arguments.
     * 
     * @param {RendererEvents} event
     * @param {...any[]} args
     * 
     * @memberof IRendererEventBus
     */
    emit(event: RendererEvents, ...args: any[]): void;
}
