import React from 'react'
import {Link} from 'react-router-dom';
import { AppBar, Button, Toolbar, Grid, Badge} from '@mui/material'
import Logo from "../images/logo.png"

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
        color: "#171717",
        fontSize: "0.9VW",
        marginTop:"0.5VH"
    };
    const imageStyle ={
        width: "100%", 
        height: "100%",
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

    return (
        <>
            <AppBar position="static" style={appbarStyle}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Grid>
                        <Button component={Link} to="/" sx={muiButtonSX} disableRipple style={buttonStyle}>
                            <img src={Logo} alt="" style={imageStyle}></img>
                        </Button>
                    </Grid>
                    <Grid style={gridStyle}>
                        <Button 
                            component={Link} 
                            to="/" 
                            sx={muiButtonSX} 
                            disableRipple 
                            style={textButtonStyle}>
                            <p>Home</p>
                        </Button>
                        <Button 
                            component={Link} 
                            to="/staking" 
                            sx={muiButtonSX} 
                            disableRipple 
                            style={textButtonStyle}>
                            <p>Staking</p>
                        </Button>
                        <Button 
                            component={Link} 
                            to="/staking" 
                            sx={muiButtonSX} 
                            disableRipple 
                            style={textButtonStyle}>
                            <p>Staking</p>
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