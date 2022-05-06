import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { Canvas, useFrame } from '@react-three/fiber'

export default function Mint(){
    return(
        <div className='navBar'>
            <ul>
                
                <li className='navs'><a href='#faq'>Logo</a></li>
                <li className='navs'>Roadmap</li>
                <li className='navs'>Faq</li>
                <li className='navs'>Whtiepaper</li>
            </ul>
  </div>
        
    )
}