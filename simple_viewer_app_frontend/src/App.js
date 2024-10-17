// App.jsx
import React, { useEffect, useRef, useState } from 'react';

import './App.css';
import { initViewer, loadModel } from './pages/Viewer/ViewerFunction';

const App = () => {
  const viewerDiv = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedUrn, setSelectedUrn] = useState('');

  useEffect(() => {
    initViewer(viewerDiv.current).then((viewerInstance) => {
      setViewer(viewerInstance);
      setupModelSelection(viewerInstance);
    });
  }, []);

  const setupModelSelection = async (viewer) => {
    try {
      const resp = await fetch('http://localhost:8080/api/models');
      const models = await resp.json();
      setModels(models);
      const initialUrn = models[0]?.urn || '';
      setSelectedUrn(initialUrn);
      if (initialUrn) {
        loadModel(viewer, initialUrn);
      }
    } catch (err) {
      console.error('Error fetching models:', err);
    }
  };

  const handleModelChange = (e) => {
    const urn = e.target.value;
    setSelectedUrn(urn);
    if (viewer) {
      loadModel(viewer, urn);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('model-file', file);

    try {
      await fetch('http://localhost:8080/api/models', { method: 'POST', body: formData });
      setupModelSelection(viewer); // Reload the model list
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div>
      <header id="header">
        <img className="logo" src="https://cdn.autodesk.io/logo/black/stacked.png" alt="Autodesk Platform Services" />
        <span className="title">Simple Viewer</span>
        <select id="models" value={selectedUrn} onChange={handleModelChange}>
          {models.map((model) => (
            <option key={model.urn} value={model.urn}>{model.name}</option>
          ))}
        </select>
        <button onClick={() => document.getElementById('input').click()}>Upload</button>
        <input type="file" id="input" style={{ display: 'none' }} onChange={handleFileUpload} />
      </header>
      <div id="preview" ref={viewerDiv}></div>
      <div id="overlay"></div>
    </div>
  );
};

export default App;
