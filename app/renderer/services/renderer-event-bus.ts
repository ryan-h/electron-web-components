import { ipcRenderer } from "electron";
import { IRendererEventBus, RendererEvents } from "./";
import { MainEvents } from "../../main/services/enumerations";

/**
 * Wraps the ipcRenderer electron event emitter to provide additional functionality.
 */
export const RendererEventBus: IRendererEventBus = {
    on(event: RendererEvents, listener: Electron.IpcRendererEventListener) {
        ipcRenderer.on(event, listener);
        return RendererEventBus;
    },
    once(event: RendererEvents, listener: Electron.IpcRendererEventListener) {
        ipcRenderer.once(event, listener);
        return RendererEventBus;
    },
    removeListener(event: RendererEvents, listener: Electron.IpcRendererEventListener) {
        ipcRenderer.removeListener(event, listener);
        return RendererEventBus;
    },
    removeAllListeners(event?: RendererEvents) {
        if (event) {
            ipcRenderer.removeAllListeners(event);
        } else {
            ipcRenderer.removeAllListeners();
        }
        return RendererEventBus;
    },
    send(event: MainEvents, ...args: any[]) {
        ipcRenderer.send(event, ...args);
    },
    sendSync(event: MainEvents, ...args: any[]): any {
        return ipcRenderer.sendSync(event, ...args);
    },
    emit(event: RendererEvents, ...args: any[]) {
        // pass null as the first arg for the ipcRendererEvent, 
        // this arg is only provided when sending inter-process
        ipcRenderer.emit(event, null, ...args);
    }
};
