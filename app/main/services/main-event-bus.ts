import { ipcMain } from "electron";
import { IMainEventBus, MainEvents } from "./";
import { RendererEvents } from "../../renderer/services/enumerations";

/**
 * Wraps the ipcMain electron event emitter to provide additional functionality.
 */
export const MainEventBus: IMainEventBus = {
    on(event: MainEvents, listener: Electron.IpcMainEventListener) {
        ipcMain.on(event, listener);
        return MainEventBus;
    },
    once(event: MainEvents, listener: Electron.IpcMainEventListener) {
        ipcMain.once(event, listener);
        return MainEventBus;
    },
    removeListener(event: MainEvents, listener: Electron.IpcMainEventListener) {
        ipcMain.removeListener(event, listener);
        return MainEventBus;
    },
    removeAllListeners(event?: MainEvents) {
        if (event) {
            ipcMain.removeAllListeners(event);
        } else {
            // Removing all listeners from ipcMain will make Electron internals stop working,
            // just remove the events that match one of the enum members
            for (const eventName of ipcMain.eventNames()) {
                if (typeof eventName === "string" && eventName !== undefined) {
                    ipcMain.removeAllListeners(eventName);
                }
            }
        }
        return MainEventBus;
    },
    send(event: RendererEvents, ...args: any[]) {
        MainEventBus.emit(MainEvents.RendererEventSend, event, ...args);
    },
    emit(event: MainEvents, ...args: any[]) {
        // pass null as the first arg for the ipcMainEvent, 
        // this arg is only provided when sending inter-process
        ipcMain.emit(event, null, ...args);
    }
};
