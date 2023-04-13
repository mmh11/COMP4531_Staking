import React, { useState } from 'react';
import { TextField, Dialog, DialogContent, Button } from '@mui/material'

const StakeModel = props => {
  const {
    open,
    onClose,
    stakingLength,
    stakingPercent,
    setAmount,
    stakeEther,
  } = props
  const diaLogDivStyle={
    width: "300px",
    height: "250px",
    textAlign: "center"
  }
  const textfieldSXStyle = {
    "& .MuiInputBase-root": { //input text
        color: "#6b6b6b"
    },
    " .MuiInputLabel-root": { //label
        color: "#6b6b6b"
    },
    "& label.Mui-focused": {
        color: "#b135ff"
    },
    "& .MuiOutlinedInput-root:hover": {
        "& > fieldset": {
          borderColor: "#b135ff",
        }
    },
    "& .MuiOutlinedInput-root": {
        "& > fieldset": { borderColor: "#b135ff" },
        "&.Mui-focused fieldset": {
            borderColor: "#b135ff"
        }
    }
  }
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <div style={diaLogDivStyle}>
            <h3>Stake ETH</h3>
            <br/>
            <div style={{display:"inline-flex", alignItems:"center"}}>
              <TextField 
                sx={textfieldSXStyle}
                id="outlined-basic" 
                variant="outlined"
                type='number'
                onChange={e => props.setAmount(e.target.value)}/>
                <p style={{marginBottom: 0}}>&nbsp;&nbsp;&nbsp;ETH</p>
            </div>
            <br/>
            <br/>
            <h6>{stakingLength} days @ {stakingPercent} APY</h6>
            <br/>
            <Button 
              variant="contained" 
              color="secondary"
              style={{height:"40px", width:"60%"}}
              onClick={() => stakeEther()}>
                Stake
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default StakeModel
