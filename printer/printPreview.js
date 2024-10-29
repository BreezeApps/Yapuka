'use strict';

var _tslib = require('./_tslib-9a18d7de.js');
var electron = require('electron');
var print_util = require('./util.js');
require('path');
require('os');
require('fs/promises');
require('fs');

const configInitPage = require('./printPage');
const { writeDataToHtml, print_page } = require("./util");
class _Pdf {
    constructor() {
        // 当执行printToPdf方法的时候禁止关闭窗口，否则chrome打印任务会一直报错
        this.isPrintingToPdf = false;
        this.isPrinting = false;
        this.pdfWin = null;
        this.handleWin = null;
        this.generatePdfAndReload = () => _tslib.__awaiter(this, void 0, void 0, function* () {
            var _a;
            let errMessage = 'pdf transform failed, please restart app !';
            let url = "";
            try {
                this.isPrintingToPdf = true;
                const pdfPath = yield print_util.generatePdfFile(this.handleWin.webContents, this.getPrintToPdfOptions());
                this.isPrintingToPdf = false;
                url = print_util.getPdfPreviewUrl(pdfPath);
                errMessage = '';
            }
            catch (e) {
                console.error(e);
                electron.dialog.showMessageBox(null, { message: errMessage });
            }
            finally {
                // chyui window is closed
                if (!errMessage) {
                    (_a = this.pdfWin) === null || _a === void 0 ? void 0 : _a.webContents.send('ready', { url });
                }
                if (!this.pdfWin) {
                    this.handleWin.close();
                }
            }
        });
        this.pageSize = print_util.defaultConfigPdfOptions.pageSize;
        this.landscape = print_util.defaultConfigPdfOptions.landscape;
        this.margin = print_util.defaultConfigPdfOptions.margin;
        this.scaleFactor = print_util.defaultConfigPdfOptions.scaleFactor;
        this.initPage({});
    }
    initPage(config) {
        const html = configInitPage(config);
        writeDataToHtml(print_page, html);
    }
    getPrintToPdfOptions() {
        let pageSize = this.pageSize;
        // @ts-ignore
        if (print_util.PAGE_SIZES[this.pageSize]) {
            // @ts-ignore
            pageSize = print_util.PAGE_SIZES[this.pageSize];
        }
        const margin = print_util.translateMM.toIches(this.margin);
        return {
            printBackground: true,
            landscape: this.landscape,
            pageSize,
            // @ts-ignore
            scale: this.scaleFactor / 100,
            margins: {
                top: margin,
                bottom: margin,
                left: margin,
                right: margin
            }
        };
    }
    ;
    getIsRunning() {
        return !(this.pdfWin && this.handleWin) || this.isPrintingToPdf || this.isPrinting;
    }
    clean() {
        this.pageSize = print_util.defaultConfigPdfOptions.pageSize;
        this.landscape = print_util.defaultConfigPdfOptions.landscape;
        this.margin = print_util.defaultConfigPdfOptions.margin;
        this.scaleFactor = print_util.defaultConfigPdfOptions.scaleFactor;
        this.htmlString = '';
    }
    reloadByPrintOptions(event, reloadOptions) {
        return _tslib.__awaiter(this, void 0, void 0, function* () {
            yield this.generatePdfAndReload();
        });
    }
    print(options) {
        return _tslib.__awaiter(this, void 0, void 0, function* () {
            this.isPrinting = true;
            this.pdfWin.close();
            yield print_util.webContentsPrint(this.handleWin.webContents, options);
            this.isPrinting = false;
            this.handleWin.close();
        });
    }
    /**
     * display pdf window
     * @param event
     * @param pdfOptions
     */
    createPdfWindow(pdfOptions, event) {
        this.htmlString = pdfOptions.htmlString;
        // We cannot require the screen module until the app is ready.
        // Create a window that fills the screen's available work area.
        // const primaryDisplay = screen.getPrimaryDisplay()
        // const { width, height } = primaryDisplay.workAreaSize //1920 1040
        // console.log(width,height)
        //The bottom toolbar is not included at win
        this.createPdfHandleWin();
        const parentWindow = electron.BrowserWindow.getFocusedWindow();
        let winOptions = {
            width: print_util.defaultConfigPdfOptions.width,
            height: print_util.defaultConfigPdfOptions.height,
            show: false,
            center: true,
            frame: false,
            hasShadow: false,
            resizable: true,
            movable: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                webSecurity: false
            },
        };
        if (parentWindow) {
            winOptions.parent = parentWindow;
            winOptions.modal = true;
        }
        this.pdfWin = new electron.BrowserWindow(winOptions);
        this.pdfWin.once('ready-to-show', () => {
            this.pdfWin.show();
        });
        this.pdfWin.webContents.once('dom-ready', () => _tslib.__awaiter(this, void 0, void 0, function* () {
            yield this.handleWin.loadURL(print_util.BLANK_PAGE);
        }));
        this.pdfWin.webContents.on('before-input-event', (event, input) => {
            if ((input.meta || input.control) && input.key === "F12") {
                this.pdfWin.webContents.openDevTools({});
            }
        });
        this.pdfWin.once('close', () => {
            console.info("PdfWindow is closing");
        });
        this.pdfWin.once("closed", () => {
            this.pdfWin = null;
            if (!(this.isPrintingToPdf || this.isPrinting)) {
                this.handleWin.close();
            }
        });
        this.pdfWin.loadURL(print_util.INDEX_PAGE);
    }
    createPdfHandleWin() {
        this.handleWin = new electron.BrowserWindow({
            width: 300,
            height: 300,
            show: false,
            frame: false,
            webPreferences: {
                sandbox: true,
                nodeIntegration: true,
                contextIsolation: false,
                webSecurity: false,
                minimumFontSize: 12,
                defaultFontFamily: {
                    standard: 'Microsoft Yauheni'
                }
            },
        });
        // 当transparent:true, 窗口背景色可以包含透明度
        // this.handleWin.setBackgroundColor('#000000') 透明
        // this.handleWin.setBackgroundColor('#11FFFFF') 白色背景，
        this.handleWin.webContents.on("dom-ready", () => _tslib.__awaiter(this, void 0, void 0, function* () {
            // const baseUrl = await getBaseUrl(this.handleWin.webContents)
            // const htmlStyle = await removeAtPageStyle(this.handleWin.webContents)
            yield this.handleWin.webContents.executeJavaScript("document.body.innerHTML=`" +
                this.htmlString +
                "`;document.head.innerHTML=`" +
                // `<base href=${baseUrl}>` +
                // htmlStyle +
                print_util.defaultPageStyle +
                '`;document.title="";');
            yield this.generatePdfAndReload();
        }));
        this.handleWin.on("closed", () => {
            var _a;
            this.handleWin = null;
            this.clean();
            (_a = this.pdfWin) === null || _a === void 0 ? void 0 : _a.close();
        });
    }
}
const printPreview = new _Pdf();

module.exports = printPreview;
