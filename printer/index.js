'use strict';

var _tslib = require('./_tslib-9a18d7de.js');
var electron = require('electron');
var print_util = require('./util.js');
var print_printPreview = require('./printPreview.js');
require('path');
require('os');
require('fs/promises');
require('fs');

electron.ipcMain.handle('get-printer-list-async', print_util.getPrinterListAsync);
electron.ipcMain.handle("close-pdf-window", print_util.closeWindow);
const print = (e, data) => _tslib.__awaiter(void 0, void 0, void 0, function* () {
    const margin = print_util.translateMM.toPixels(data.margin);
    const options = {
        silent: data.silent,
        deviceName: data.deviceName,
        pageSize: data.pageSize,
        printBackground: true,
        margins: {
            marginType: "custom",
            top: margin,
            bottom: margin,
            left: margin,
            right: margin
        },
        landscape: !!data.landscape,
        scaleFactor: data.scaleFactor,
    };
    yield print_printPreview.print(options);
});
electron.ipcMain.handle("print", print);
// @ts-ignore
electron.ipcMain.on('reload-pdf', (e, reloadOptions) => _tslib.__awaiter(void 0, void 0, void 0, function* () {
    let isToReload = false;
    if (print_printPreview.getIsRunning()) {
        console.warn('The instance has been destroyed. Please run it again');
    }
    if ((typeof reloadOptions.isLandscape) !== 'boolean' || print_printPreview.landscape === reloadOptions.isLandscape) {
        console.info("The current print direction has not changed");
    }
    else {
        print_printPreview.landscape = reloadOptions.isLandscape;
        isToReload = true;
    }
    if (!reloadOptions.scaleFactor || print_printPreview.scaleFactor === reloadOptions.scaleFactor) {
        console.info("The current print scaleFactor has not changed");
    }
    else {
        print_printPreview.scaleFactor = reloadOptions.scaleFactor;
        isToReload = true;
    }
    if (!reloadOptions.pageSize || print_printPreview.pageSize === reloadOptions.pageSize) {
        console.info("The current print pageSize has not changed");
    }
    else {
        print_printPreview.pageSize = reloadOptions.pageSize;
        isToReload = true;
    }
    if (!reloadOptions.margin || print_printPreview.margin === reloadOptions.margin) {
        console.info("The current print margin has not changed");
    }
    else {
        print_printPreview.margin = reloadOptions.margin;
        isToReload = true;
    }
    if (!isToReload) {
        console.info("Cancel this processing...");
        return;
    }
    yield print_printPreview.reloadByPrintOptions(e, reloadOptions);
}));
const startPrint = print_printPreview.createPdfWindow.bind(print_printPreview);
const initPrintPgae = print_printPreview.initPage.bind(print_printPreview);

exports.initPrintPgae = initPrintPgae;
exports.startPrint = startPrint;
