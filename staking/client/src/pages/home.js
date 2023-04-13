import React from "react";

export default function Home() {
    return(
        <div>
            <div style={{marginLeft:"8VW",marginTop:"45VH"}}>
                <img style={{width:"35VW"}} src={require("../images/logoName.png")}></img>
            </div>
            <h1 style={{ 
                fontSize: "1.5VW", 
                color:"#7f00cf",
                marginLeft:"8VW"}}>
                Earn your passive income with crypto now!
            </h1>
        </div>
    )
 }