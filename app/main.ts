import { app, BrowserWindow } from "electron";
import { MainEventBus, MainEvents } from "./main/services";
import { RendererEvents } from "./renderer/services";

// *** Variables ***

let mainWindow: Electron.BrowserWindow | null = null;

// *** Events ***

app.on("ready", onAppReady);

MainEventBus.on(MainEvents.Route, onRoute);
MainEventBus.on(MainEvents.RendererEventSend, onRendererEventSend);

// *** Functions ***

/**
 * Event handler for when the application is ready. 
 */
function onAppReady(): void {
    mainWindow = new BrowserWindow({
        width: 1500,
        height: 900,
        minWidth: 1024,
        minHeight: 768,
        frame: true,
        show: false
    });

    mainWindow.once("ready-to-show", mainWindow.show);

    mainWindow.on("closed", onWindowClosed);

    // add listeners specific to the webContents of the main window
    mainWindow.webContents.on("crashed", onWindowCrashed);
    mainWindow.webContents.on("dom-ready", onDomReady);

    mainWindow.loadURL(`file://${__dirname}/renderer/app.html`);
}

/**
 * Event handler for when the DOM is loaded for the web contents of this window.
 * 
 * @param {Electron.Event} event 
 */
function onDomReady(event: Electron.Event): void {
    MainEventBus.emit(MainEvents.Route, "home");
}

/**
 * Handles sending an event and args to the renderer process of the main window.
 * 
 * @param {(Electron.IpcMainEvent | null)} event 
 * @param {string} channel 
 * @param {...any[]} args 
 */
function onRendererEventSend(event: Electron.IpcMainEvent | null, channel: string, ...args: any[]): void {
    if (mainWindow) {
        mainWindow.webContents.send(channel, ...args);
    }
}

/**
 * Handles requests for changing the application route.
 * 
 * @param {(Electron.IpcMainEvent | null)} event 
 * @param {(string | undefined)} view 
 */
function onRoute(event: Electron.IpcMainEvent | null, view: string | undefined): void {
    if (view) {
        MainEventBus.send(RendererEvents.RouteChanged, view);
    }
}

/**
 * Handles when the main window has been closed (destroyed). 
 * Allows for releasing resources prior to closing.
 */
function onWindowClosed(): void {
    app.removeAllListeners();

    if (mainWindow !== null) {
        mainWindow.removeAllListeners();
        mainWindow = null;
    }
}

/**
 * Event handler for when the window has crashed.
 * 
 * @param {Electron.Event} event 
 * @param {boolean} killed 
 */
function onWindowCrashed(event: Electron.Event, killed: boolean): void {
    app.exit();
}
