import { Html, PerspectiveCamera ,OrbitControls,Stats,Text} from "@react-three/drei";
import { angleToRadians } from "../utils/angle";
import { extend, useThree, useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React, { useRef, useMemo } from "react";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Link, Router} from "react-router-dom";
import "./Hero.css"

import { useNavigate } from "react-router-dom";





export default function Hero(){
  const navigate = useNavigate();
    return( 
        <>
     
        <div className="cta" >
          <h1 className="gradient-text" id="yoshi">  
            CryptoYachtClub
          </h1>
          <button className="buttons" onClick={() => navigate("/mint")}><span>MINT</span> <span class="emphasis">YOU'RE NFTS</span></button>
          </div>
  
   
        </>
    )
}