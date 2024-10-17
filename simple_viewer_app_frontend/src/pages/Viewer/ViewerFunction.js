/* global Autodesk, THREE */
import Client from "../Auth";
import axios from "axios";


async function getAccessToken(callback) {
    const resp = await fetch('http://localhost:8080/api/auth/token');
    const { access_token, expires_in } = await resp.json();
    callback(access_token, expires_in);
}

export function initViewer(container) {
    return new Promise((resolve) => {
        Autodesk.Viewing.Initializer({ env: 'AutodeskProduction', getAccessToken }, () => {
            const viewer = new Autodesk.Viewing.GuiViewer3D(container);
            viewer.start();
            viewer.setTheme('light-theme');
            resolve(viewer);
        });
    });
}

export function loadModel(viewer, urn) {
    return new Promise((resolve, reject) => {
        function onDocumentLoadSuccess(doc) {
            resolve(viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry()));
        }
        function onDocumentLoadFailure(code, message) {
            reject({ code, message });
        }
        Autodesk.Viewing.Document.load(`urn:${urn}`, onDocumentLoadSuccess, onDocumentLoadFailure);
    });
}
