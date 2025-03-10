import React from "react";
import { Outlet } from "react-router-dom";
import NavBars from "../NavBars_Component/NavBars";
// import NavBars from "../NAVBAR/NavBars";
// import Footer from "../Footer/Footer";

const Root= ()=>{
    return(
        <div>
            
            <div><NavBars></NavBars></div>

            <div><Outlet></Outlet></div>

            {/* <div><Footer></Footer></div> */}

        </div>
    )
}

export default Root;