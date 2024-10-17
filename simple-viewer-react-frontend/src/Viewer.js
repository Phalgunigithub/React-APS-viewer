// viewer.js
/* global Autodesk */
async function getAccessToken(callback) {
    const resp = await fetch('http://localhost:8080/api/auth/token');
    const { access_token, expires_in } = await resp.json();
    callback(access_token, expires_in);
    console.log("access token "+access_token);
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

export async function getModelProperties(urn) {
    // const token = await getAccessToken();
      // Create a dummy callback function to pass to getAccessToken
      const token = await new Promise((resolve) => {
        getAccessToken((access_token) => {
            resolve(access_token);
        });
    });
    const metadataUrl = `https://developer.api.autodesk.com/model-derivative/v2/viewers/urn:${urn}/metadata`;

    const metadataResp = await fetch(metadataUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).catch(err => console.error('Error fetching metadata:', err));

    if (!metadataResp.ok) {
        throw new Error(`Failed to fetch metadata: ${metadataResp.statusText}`);
    }
    const metadata = await metadataResp.json();
    const guid = metadata.data.guid; // Extract the GUID

    const propertiesUrl = `https://developer.api.autodesk.com/model-derivative/v2/viewers/urn:${urn}/properties?guid=${guid}`;

    const propertiesResp = await fetch(propertiesUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const properties = await propertiesResp.json();
    return properties; // Make sure to return the whole properties object
}
