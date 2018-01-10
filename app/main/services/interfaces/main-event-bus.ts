import { MainEvents } from "../";
import { RendererEvents } from "../../../renderer/services";

export interface IMainEventBus {
    /**
     * Adds an event listener to the event.
     * 
     * @param {MainEvents} event
     * @param {Electron.IpcMainEventListener} listener
     * @returns {this}
     * 
     * @memberof IMainEventBus
     */
    on(event: MainEvents, listener: Electron.IpcMainEventListener): this;
    /**
     * Adds a single use event listener to an event.
     * 
     * @param {MainEvents} event
     * @param {Electron.IpcMainEventListener} listener
     * @returns {this}
     * 
     * @memberof IMainEventBus
     */
    once(event: MainEvents, listener: Electron.IpcMainEventListener): this;
    /**
     * Remove a single listener from the event bus.
     * 
     * @param {MainEvents} event
     * @param {Electron.IpcMainEventListener} listener
     * @returns {this}
     * 
     * @memberof IMainEventBus
     */
    removeListener(event: MainEvents, listener: Electron.IpcMainEventListener): this;
    /**
     * Remove all listeners for the given event.
     * 
     * @param {MainEvents} [event]
     * @returns {this}
     * 
     * @memberof IMainEventBus
     */
    removeAllListeners(event?: MainEvents): this;
    /**
     * Send ...args to renderer via event in asynchronous message, the renderer
     * process can handle it by listening to the event on the RendererEventBus.
     * 
     * @param {RendererEvents} event 
     * @param {...any[]} args 
     * 
     * @memberof IMainEventBus
     */
    send(event: RendererEvents, ...args: any[]): void;
    /**
     * Emits the event to any listeners on the main process. Passing along any arguments.
     * 
     * @param {MainEvents} event
     * @param {...any[]} args
     * 
     * @memberof IMainEventBus
     */
    emit(event: MainEvents, ...args: any[]): void;
}
