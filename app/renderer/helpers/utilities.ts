import * as path from "path";
import * as fs from "fs";
import * as url from "url";

/**
 * Checks whether the directory exists.
 * 
 * @export
 * @param {string} directory 
 * @returns {boolean} 
 */
export function checkDirectory(directory: string): boolean {
    try {
        if (directory) {
            return fs.existsSync(path.normalize(directory));
        }
    } catch {}

    return false;
}

/**
 * Converts the contents of an HTML file into a node.
 *
 * @export
 * @param {string} filePath
 * @returns {Node}
 */
export function convertHtmlFileToNode(filePath: string): Node {
    let html = "";

    const normalizedPath = path.normalize(filePath.toLowerCase());

    if (path.extname(normalizedPath) === ".html" &&
        checkDirectory(normalizedPath)) {
        html = fs.readFileSync(normalizedPath, "utf-8");
    }

    return convertHtmlToNode(html);
}

/**
 * Converts an HTML string into a node.
 *
 * @export
 * @param {string} html
 * @returns {Node}
 */
export function convertHtmlToNode(html: string): Node {
    const template = document.createElement("template");

    if (html) {
        template.innerHTML = html;
    }

    return template.content;
}

/**
 * Removes all children elements of a node.
 * 
 * @export
 * @param {(ShadowRoot | Node | null)} node
 */
export function removeChildren(node: ShadowRoot | Node | null): void {
    if (node) {
        while (node.lastChild) {
            node.removeChild(node.lastChild);
        }
    }
}

/**
 * Gets the serialized URL for the provided file path.
 * 
 * @param {string} filePath
 * @returns {string} 
 */
export function getFileUrl(filePath: string): string {
    // catch the type error thrown due to an invalid URL
    try {
        const fileUrl = new url.URL(`file:///${filePath}`);
        return fileUrl.href;
    } catch {
        return "";
    }
}
