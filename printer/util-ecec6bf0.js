'use strict';

var electron = require('electron');
var path = require('path');
var os = require('os');
var promises = require('fs/promises');
var fs = require('fs');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const getPrinterListAsync = (e) => __awaiter(void 0, void 0, void 0, function* () {
    let retArr = [];
    // @ts-ignore
    let list = yield e.sender.getPrintersAsync();
    for (let index in list) {
        retArr.push({
            name: list[index].name,
            isDefault: list[index].isDefault,
        });
    }
    return {
        printDevices: retArr
    };
});
const closeWindow = (e) => {
    const targetWin = electron.BrowserWindow.fromWebContents(e.sender);
    targetWin && targetWin.close();
};
/**
 * be like 26dec868-b29f-42e5-9eb6-9c59396ae411
 */
const uuid = () => {
    // @ts-ignore
    const tempUrl = URL.createObjectURL(new Blob({}, {}));
    const uuid = tempUrl.toString();
    URL.revokeObjectURL(tempUrl);
    return uuid.substring(uuid.lastIndexOf("/") + 1);
};
const generateRandom = () => {
    return Math.random().toString(16).slice(2);
};
const getBaseUrl = (webContents) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield webContents.executeJavaScript("document.baseURI");
    return res;
});
/**
 * remove @page style
 * @param contens
 */
const removeAtPageStyle = (webContents) => __awaiter(void 0, void 0, void 0, function* () {
    const headHtml = yield webContents.executeJavaScript("document.head.innerHTML");
    let newHeadHtml = headHtml.replaceAll(/@page\s*{[\s\S^}]*?margin[\s\S^}]*?}/g, "");
    // await webContents.executeJavaScript("document.head.innerHTML=" + newHeadHtml)
    return newHeadHtml;
});
/***
 * isStyleRendered
 * @param contens
 */
const isStyleRendered = (webContens) => __awaiter(void 0, void 0, void 0, function* () {
    yield webContens.executeJavaScript(`document.querySelectorAll('link[rel="stylesheet"]').length==[].slice.call(document.styleSheets).filter(({href})=>href!=null).length`);
    return true;
});
let styleRenderedInterval;
const awaitStyleRendered = (webContents) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(resolve => {
        styleRenderedInterval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield isStyleRendered(webContents);
            if (res) {
                // @ts-ignore
                clearInterval(styleRenderedInterval);
                styleRenderedInterval = undefined;
                return resolve(true);
            }
        }), 1000);
    });
});
/**
 * @param webContents
 * @param printToPdfOptions
 */
const generatePdfFile = (webContents, printToPdfOptions) => __awaiter(void 0, void 0, void 0, function* () {
    yield awaitStyleRendered(webContents);
    const pdfPath = path.join(os.tmpdir(), `j_y_pdf_${generateRandom()}.pdf`);
    const data = yield webContents.printToPDF(printToPdfOptions);
    yield promises.writeFile(pdfPath, data);
    return pdfPath;
});
const webContentsPrint = (webContens, options) => {
    return new Promise(res => {
        if (!webContens) {
            return res(false);
        }
        webContens.print(options, (success, failureReason) => {
            if (success) {
                return res(true);
            }
            else {
                if (failureReason !== "Print job canceled") {
                    electron.dialog.showErrorBox('print', failureReason);
                }
                return res(false);
            }
        });
    });
};
const cleanBrowserView = (targetWin) => {
    let v = targetWin.getBrowserView();
    if (v) {
        // @ts-ignore
        v.webContents.destroy();
        targetWin.removeBrowserView(v);
        v = null;
    }
};
const cleanBrowserViews = (targetWin) => {
    let vs = targetWin.getBrowserViews();
    vs.forEach(v => {
        // @ts-ignore
        v.webContents.destroy();
        targetWin.removeBrowserView(v);
    });
};
const getPdfPreviewUrl = (pdfPath) => {
    return `file:///${pdfPath}#scrollbars=0&toolbar=0&statusbar=0&view=Fit`;
};
const PAGE_SIZES = {
    //纸张自定义尺寸 MM
    custom: {
        width: 200,
        height: 140
    }
};
const translateMM = {
    toIches: (number) => {
        return parseFloat((number / 25.4).toFixed(2));
    },
    toMicorn: (number) => {
        return number * 1000;
    },
    toPixels: (number) => {
        return parseInt((number / 25.4 * 96).toFixed(2));
    }
};
// chrome 默认页面样式
const defaultPageStyle = ` <style>
        html{
        width: 100% !important;
        height: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        box-sizing: border-box !important;
        }
        body{
        font-family: Microsoft Yahei;
        font-size: 81.25%;
        min-width: min-content !important;
        max-width: 100% !important;
        height: fit-content !important;
        padding: 0 !important;
        margin: 0 !important;
        box-sizing: border-box !important;
        }
        </style>`;
const isDevelopment = process.env.NODE_ENV !== 'production';
const defaultConfigPdfOptions = {
    name: "PdfWindow",
    width: 1000,
    height: 650,
    controlPanelWidth: 370,
    pageSize: "A4",
    landscape: false,
    margin: 10,
    scaleFactor: 100
};
const copyDirectory = (src, target) => {
    console.log(src, target);
    try {
        fs__namespace.accessSync(target);
    }
    catch (e) {
        console.log(e);
        fs__namespace.mkdirSync(target, { recursive: true });
    }
    const files = fs__namespace.readdirSync(src);
    files.forEach((item) => {
        const source = path.resolve(src, item);
        const dest = path.resolve(target, item);
        const stat = fs__namespace.statSync(source);
        if (stat.isFile()) {
            fs__namespace.copyFileSync(source, dest);
        }
        else if (stat.isDirectory()) {
            fs__namespace.mkdirSync(dest, { recursive: true });
            copyDirectory(source, dest);
        }
    });
};
const print_page = path.resolve(electron.app.getPath("userData"), 'electron-print-preview', `print_page.html`);
const writeDataToHtml = (filePath, data) => {
    const dir = path.dirname(filePath);
    if (!fs__namespace.existsSync(dir)) {
        fs__namespace.mkdirSync(dir, { recursive: true });
    }
    fs__namespace.writeFileSync(filePath, data);
};
const INDEX_PAGE = print_page;
const BLANK_PAGE = 'about:blank';

exports.BLANK_PAGE = BLANK_PAGE;
exports.INDEX_PAGE = INDEX_PAGE;
exports.PAGE_SIZES = PAGE_SIZES;
exports.__awaiter = __awaiter;
exports.awaitStyleRendered = awaitStyleRendered;
exports.cleanBrowserView = cleanBrowserView;
exports.cleanBrowserViews = cleanBrowserViews;
exports.closeWindow = closeWindow;
exports.copyDirectory = copyDirectory;
exports.defaultConfigPdfOptions = defaultConfigPdfOptions;
exports.defaultPageStyle = defaultPageStyle;
exports.generatePdfFile = generatePdfFile;
exports.generateRandom = generateRandom;
exports.getBaseUrl = getBaseUrl;
exports.getPdfPreviewUrl = getPdfPreviewUrl;
exports.getPrinterListAsync = getPrinterListAsync;
exports.isDevelopment = isDevelopment;
exports.isStyleRendered = isStyleRendered;
exports.print_page = print_page;
exports.removeAtPageStyle = removeAtPageStyle;
exports.translateMM = translateMM;
exports.uuid = uuid;
exports.webContentsPrint = webContentsPrint;
exports.writeDataToHtml = writeDataToHtml;
