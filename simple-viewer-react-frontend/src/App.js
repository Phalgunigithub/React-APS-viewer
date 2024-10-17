/* global Autodesk */
import React, { useEffect, useRef, useState } from 'react';
import { getModelProperties, initViewer, loadModel } from './Viewer';
import './App.css';


const App = () => {
  const viewerDiv = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedUrn, setSelectedUrn] = useState('');

  //event
  const [selectionCount, setSelectionCount] = useState(0);
  const [activeTool, setActiveTool] = useState('Unknown');

  //extract prperties
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    initViewer(viewerDiv.current).then((viewerInstance) => {
      setViewer(viewerInstance);
      setupModelSelection(viewerInstance);

     // Set up event listeners
      const onSelectionEvent = () => {
        const selection = viewerInstance.getSelection();
        setSelectionCount(selection.length); // Update selection count
      };

      const onNavigationModeEvent = (event) => {
        setActiveTool(event.id); // Update active tool
      };

      // Add event listeners
      viewerInstance.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, onSelectionEvent);
      viewerInstance.addEventListener(Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT, onNavigationModeEvent);

      // Cleanup function to remove event listeners
      return () => {
        viewerInstance.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, onSelectionEvent);
        viewerInstance.removeEventListener(Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT, onNavigationModeEvent);
      };
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
      console.log("urn is"+initialUrn);
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

  const handleSearch = () => {
    if (viewer && searchTerm) {
      viewer.search(searchTerm, function (dbIDs) {
        if (dbIDs.length > 0) {
          viewer.isolate(dbIDs);
          viewer.fitToView(dbIDs);
        } else {
          alert("No elements found with the given property.");
        }
      });
    }
  };
//   const handleSearch = async () => {
//     //if (!viewer || !searchTerm) return;
    
//     // Query model properties
//     //const properties = await getModelProperties(selectedUrn);
//     //const propertyValue = searchTerm.trim();

//     // Find the node IDs matching the property name
//     // const dbIDs = [];
//     // properties.data.attributes.properties.forEach((property) => {
//     //     if (property.name.includes(propertyValue)) {
//     //         dbIDs.push(property.dbId); // Replace with actual way to get dbId
//     //     }
//     // });

//     //if (dbIDs.length > 0) {
//         viewer.isolate(searchTerm);
//         viewer.fitToView(searchTerm);
//     //} else {
//      //   alert('No elements found for this search term.');
//    // }
// };

  return (
    <div>
      <header id="header">
        <img className="logo" src="https://cdn.autodesk.io/logo/black/stacked.png" alt="Autodesk Platform Services" />
        <span className="title">Simple Viewer</span>

        {/* <div className="my-custom-ui">
        <div>Items selected: <span id="MySelectionValue">{selectionCount}</span></div>
        <div>Navigation tool: <span id="MyToolValue">{activeTool}</span></div>
      </div> 
      */}

          <input type="search" id="filter" value={searchTerm} placeholder="Enter property name" onChange={(e) => setSearchTerm(e.target.value)} />
          <button id="search" onClick={handleSearch}>Search</button>
                    
        <select id="models" value={selectedUrn} onChange={handleModelChange}>
          {models.map((model) => (
            <option key={model.urn} value={model.urn}>{model.name}</option>
          ))}
        </select>
        <button onClick={() => document.getElementById('input').click()}>Upload</button>
        <input type="file" id="input" style={{ display: 'none' }} onChange={handleFileUpload} />
      
      
      
      </header>

      
      <div id="preview" ref={viewerDiv}>
    
      </div>
      <div id="overlay"></div>
    </div>
  );
};

export default App;

