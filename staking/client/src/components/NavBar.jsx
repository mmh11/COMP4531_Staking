import React from 'react'
import {Link,useLocation} from 'react-router-dom';
import { AppBar, Button, Toolbar, Grid, Badge} from '@mui/material'

const NavBar = props => {
    const appbarStyle = {
        background: "transparent", 
        boxShadow: "none"
    };
    const buttonStyle = {
        maxWidth:"300px",
        marginLeft:"8VW",
    };
    const muiButtonSX = {
        "&:hover": { 
            backgroundColor: "transparent",
            textDecoration: "underline"
        }
    };
    const textButtonStyle = {
        maxWidth:"450px",
        marginLeft:"3VW",
        color: "#000000",
        fontSize: "0.9VW",
        marginTop:"0.5VH"
    };
    const textButtonStyleClicked = {
        maxWidth:"450px",
        marginLeft:"3VW",
        color: "#f30987",
        fontSize: "0.9VW",
        marginTop:"0.5VH"
    };
    const imageStyle ={
        width: "6VW", 
        height: "6VW",
    };
    const gridStyle = {
        whiteSpace: "nowrap",
        marginRight: "8VW",
        display: "inline-flex"
    }
    const gridStyle2 = {
        display: "inline-flex"
    }
    const nameDivStyle = {
        alignSelf: "center",
        color: "#f30987",
        fontSize: "1.5VW"
    }
    const location = useLocation().pathname;

    return (
        <>
            <AppBar position="static">
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Grid>
                        <Button>

                        </Button>
                    </Grid>
                </Toolbar>
            </AppBar>
            {/* <div className="navBar">
                <div className="navButton">Markets</div>
                <div className="navButton">Assets</div>
                {props.isConnected() ? (
                    <div className="connectButton">
                        Connected
                    </div>
                ) : (
                    <div 
                    onClick={() => props.connect()}
                    className="connectButton">
                        Connect Wallet
                    </div>
                )}
            </div> */}
        </>
    )
}

export default NavBar