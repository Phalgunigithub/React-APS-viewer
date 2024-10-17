import { useEffect } from "react";
import launchViewer from "./ViewerFunction";

export function Viewer(){


    useEffect(() => {
        const documentId = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6cmVjYXQtdmlld2VyL3JhY2Jhc2ljc2FtcGxlcHJvamVjdC5ydnQ';
        launchViewer('viewerDiv',documentId);
      
    }, [])
    

    return(
        <div style ={{position:"absolute",width:"100%",height:"85%"}} id="viewerDiv">

        </div>
    )
}