import { useState,useEffect } from "react"
import { AppBar, Toolbar, Typography, IconButton, Button, FormControl, Select, Dialog,
   MenuItem, DialogTitle, DialogContentText, DialogContent, DialogActions, InputLabel } from '@mui/material';
 import MenuIcon from '@mui/icons-material/Menu'; // Import MenuIcon
import { Viewer } from "./Viewer/Viewer";


export default function Home(){
 
    
   return(
    <div className="viewer-home">

<AppBar position="static" style={{marginBottom:25}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Simple Viewer
          </Typography>
          <Button color="inherit">Update</Button>
        </Toolbar>
      </AppBar>

      <Viewer/>
    </div>

   ) ;
}