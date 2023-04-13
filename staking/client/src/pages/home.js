import React from "react";
import { motion } from "framer-motion"

export default function Home() {
    return(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <div style={{marginLeft:"8VW",marginTop:"45VH"}}>
                <img style={{width:"35VW"}} src={require("../images/logoName.png")}></img>
            </div>
            <h1 style={{ 
                fontSize: "1.5VW", 
                color:"#7d7d7d",
                marginLeft:"8VW"}}>
                Earn your passive income with crypto now!
            </h1>
        </motion.div>
    )
 }