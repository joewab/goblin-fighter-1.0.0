import cloud1 from "../assets/animated-storm.png";
import cloud2 from "../assets/animated-storm-2.png";
import { useState } from "react";
import React from "react";

type Props = {
    scrollStarted: boolean;
    arenaInView: boolean;
}

const Clouds: React.FC<Props> = ( { scrollStarted, arenaInView } ) => {

    return !arenaInView? (
    <>
        <div className={`cloud-1 ${scrollStarted ? "animateCloud1" : ""}`}>
            <img src={cloud1} alt="cloud"/>
        </div>
        <div className={`cloud-2 ${scrollStarted ? "animateCloud2" : ""}`}>
            <img src={cloud2} alt="cloud"/>
        </div>
    </>
    ) :
    (null);
}

export default Clouds;