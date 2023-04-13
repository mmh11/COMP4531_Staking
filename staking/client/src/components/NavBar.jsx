import React from 'react'
import {Link, useLocation} from 'react-router-dom';
import { AppBar, Button, Toolbar, Grid } from '@mui/material'
import Logo from "../images/logo.png"

const NavBar = props => {
    const appbarStyle = {
        background: "transparent", 
        boxShadow: "none",
        height: "10VH",
    };
    const buttonStyle = {
        maxWidth:"300px",
        marginLeft:"8VW",
        marginTop: "4VH"
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
        marginTop:"4VH"
    };
    const textButtonCurrentStyle = {
        maxWidth:"450px",
        marginLeft:"3VW",
        color: "#ff9900",
        fontSize: "0.9VW",
        marginTop:"4VH"
    }
    const imageStyle ={
        width: "100%", 
        height: "100%",
    };
    const gridStyle = {
        whiteSpace: "nowrap",
        marginRight: "8VW",
        display: "inline-flex"
    }
    const location = useLocation().pathname;
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
                            style={(location==="/")?textButtonCurrentStyle:textButtonStyle}>
                            <p>Home</p>
                        </Button>
                        <Button 
                            component={Link} 
                            to="/staking" 
                            sx={muiButtonSX} 
                            disableRipple 
                            style={(location==="/staking")?textButtonCurrentStyle:textButtonStyle}>
                            <p>Staking</p>
                        </Button>
                        {props.isConnected() ? (
                            <Button 
                                sx={muiButtonSX} 
                                disableRipple 
                                style={textButtonStyle}>
                                <p>Connected!</p>
                            </Button>
                        ) : (
                            <Button
                                sx={muiButtonSX} 
                                disableRipple 
                                style={textButtonStyle}
                                onClick={() => props.connect()}>
                                <p>Connect Wallet</p>
                            </Button>
                        )}
                    </Grid>
                </Toolbar>
            </AppBar>
        </>
    )
}

export default NavBar