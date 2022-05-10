import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense } from "react";
import { slide as Menu } from 'react-burger-menu';
import "animate.css/animate.min.css";
import { AnimationOnScroll } from 'react-animation-on-scroll';
import  Hero from './components/Hero'
import Mint from './Mint'
import { Link, Router} from "react-router-dom";





const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
background: -webkit-linear-gradient(left, #0A1F0D, #35aee2);
background-size: 200% 200%;
animation: gradient-animation 4s ease infinite;
height: 4rem;
border: 0;
margin: auto;
margin-top: 1rem;

padding-left: 40px;
padding-right: 40px;
border-radius: 5px;
cursor: pointer;
font-size: 1em;
font-weight: bold;
color: snow;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 48%;
  
  @media (min-width: 767px) {
    width: 13rem;
    margin-left: auto;
  }
  
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  

  background-color: var(--accent);
  border-radius: 100%;
  width: 30%;
  @media (min-width: 900px) {
    width: 40%;
  }
  @media (min-width: 1000px) {
    width: 55%;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--primary);
  text-decoration: none;
  text-shadow: -10px 0px 10px white;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };
  const openWindow = () => {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
          
      if((navigator.userAgent.indexOf("Safari")) || (navigator.userAgent.indexOf("Chrome"))){
        window.open("https://metamask.app.link/dapp/cryptoyacht.vercel.app/mint/")
       
      
      // open the deeplink page 
      
      
      }else{
        return;
      }

  }}
  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <>

    <s.Screen>
      <Menu stack>
      <Link to="/"><img src={"/config/images/logo.png"} width="95" height={35}></img></Link>
      <a href="#roadmap" className="menu-item">Roadmap</a>
      <a href="#faq" className="menu-item">Faq</a>
      <a href="#whitepaper" className="menu-item">Whitepaper</a>
      <a href="https://discord.com/" target="_blank"><img src="https://i.pinimg.com/564x/cf/64/fc/cf64fcce5cc8296544516488631ad676.jpg" width="35" height="35"></img></a>
      <a href="https://www.instagram.com/?hl=en" target="_blank"><img src="https://i.pinimg.com/originals/36/77/7f/36777f93ecf8062a887a748c3dfeac31.jpg" width="45" height="45"></img></a>
      <Link to="/mint">mint</Link>
        </Menu>
      
     
      


        <div className="header">
        <Link to="/"><StyledLogo alt={"logo"} src={"/config/images/logo.png"}   /></Link>
         
        </div>
        <s.SpacerSmall />
        
          <Canvas>
            <Suspense fallback={null}>
              <Hero />
            </Suspense>
            </Canvas>
            <Link to="/mint"><button className="buttons calltoo cta">MINT YOUR NFT'S</button></Link>
        
          
        
        
        
   
        <div className="about"> 
            
            <button className="buttons"><span>CRYPTO</span> <span class="emphasis">YACHT CLUB</span></button>
            <h1 className="gradient-text">ABOUT US</h1>
            <div className="aboutcont">
              <p className="aboutText">Lorem ipsum dolor sit amet consectetur adipisicing elit. Non ullam excepturi itaque impedit quos. Expedita quis commodi tempore, quam laboriosam rerum ratione praesentium quia iusto dolore est asperiores quasi aliquam? </p>
            </div>
  

    
            
        
        
        </div>
        <div>
        <button className="buttons"> <span class="emphasis">ROAD MAP</span></button>
          <a name="roadmap"></a>
          <div class="timeline">
  <div class="container left">
   
    <i class="icon fa fa-home"></i>
    <AnimationOnScroll animateIn="animate__backInUp " animateOnce>
    <div class="content">
      <h2>Phase 1</h2>
      <p>
        Lorem ipsum dolor sit amet elit. Aliquam odio dolor, id luctus erat sagittis non. Ut blandit semper pretium.
      </p>
    </div></AnimationOnScroll>
  </div>
  <div class="container right">

    <i class="icon fa fa-gift"></i>
    <AnimationOnScroll animateIn="animate__backInUp " animateOnce>
    <div class="content">
      <h2>Phase 2</h2>
      <p>
        Lorem ipsum dolor sit amet elit. Aliquam odio dolor, id luctus erat sagittis non. Ut blandit semper pretium.
      </p>
    </div></AnimationOnScroll>
  </div>
  <div class="container left">
   
    <i class="icon fa fa-user"></i>
    <AnimationOnScroll animateIn="animate__backInUp " animateOnce>
    <div class="content">
      <h2>Phase 3</h2>
      <p>
        Lorem ipsum dolor sit amet elit. Aliquam odio dolor, id luctus erat sagittis non. Ut blandit semper pretium.
      </p>
    </div></AnimationOnScroll>
  </div>
  <div class="container right">
   
    <i class="icon fa fa-running"></i>
    <AnimationOnScroll animateIn="animate__backInUp " animateOnce>
    <div class="content">
      <h2>Phase 4</h2>
      <p>
        Lorem ipsum dolor sit amet elit. Aliquam odio dolor, id luctus erat sagittis non. Ut blandit semper pretium.
      </p>
    </div></AnimationOnScroll>
  </div>
  <div class="container left">
    
    <i class="icon fa fa-cog"></i>
    <AnimationOnScroll animateIn="animate__backInUp " animateOnce>
    <div class="content">
      <h2>Phase 5</h2>
      <p>
        Lorem ipsum dolor sit amet elit. Aliquam odio dolor, id luctus erat sagittis non. Ut blandit semper pretium.
      </p>
    </div></AnimationOnScroll>
  </div>
  <div class="container right">
    
    <i class="icon fa fa-certificate"></i>
    <AnimationOnScroll animateIn="animate__backInUp " animateOnce>
    <div class="content">
      <h2>Phase 6</h2>
      <p>
        Lorem ipsum dolor sit amet elit. Aliquam odio dolor, id luctus erat sagittis non. Ut blandit semper pretium.
      </p>
      
          </div></AnimationOnScroll>
        </div>
      </div>
                    </div>
            
            
            
            <div className="faq">
            <a name="faq"></a>
            <button className="buttons"> <span class="emphasis">F.A.Q</span></button>
            <div class="box-content-colapse">
	<div class="intro-colapse">
		<span class="caption primary-medium-color"></span>
		<h4 class="title">
			
		</h4>
	</div>

	<details class="details-comp">
		<summary class="summary-colapse">
			Titulo aqui asdfasdf asdfasdfasdf asdfasdfasdf asdf
		</summary>
		<p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Non ullam excepturi itaque impedit quos. Expedita quis commodi tempore, quam laboriosam rerum ratione praesentium quia iusto dolore est asperiores quasi aliquam?</p>
	</details>
  <details class="details-comp">
		<summary class="summary-colapse">
			Titulo aqui asdfasdf asdfasdfasdf asdfasdfasdf asdf
		</summary>
		<p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Non ullam excepturi itaque impedit quos. Expedita quis commodi tempore, quam laboriosam rerum ratione praesentium quia iusto dolore est asperiores quasi aliquam?</p>
	</details>
  <details class="details-comp">
		<summary class="summary-colapse">
			Titulo aqui asdfasdf asdfasdfasdf asdfasdfasdf asdf
		</summary>
		<p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Non ullam excepturi itaque impedit quos. Expedita quis commodi tempore, quam laboriosam rerum ratione praesentium quia iusto dolore est asperiores quasi aliquam?</p>
	</details>
  <details class="details-comp">
		<summary class="summary-colapse">
			Titulo aqui asdfasdf asdfasdfasdf asdfasdfasdf asdf
		</summary>
		<p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Non ullam excepturi itaque impedit quos. Expedita quis commodi tempore, quam laboriosam rerum ratione praesentium quia iusto dolore est asperiores quasi aliquam?</p>
	</details>

</div>
        </div>
        <button className="buttons"><span class="emphasis">WHITEPAPER</span></button>

        <div className="whitePaper">
        <AnimationOnScroll animateIn="animate__jello ">
          <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Sun">
            <rect width="120" height="100" />
            <g id="sunny">
            <path id="Vector" d="M51.2222 24C51.2222 24 51.2222 21 54.5 21C57.7778 21 57.7778 24 57.7778 24V27C57.7778 27 57.7778 30 54.5 30C51.2222 30 51.2222 27 51.2222 27V24ZM80.7222 45C80.7222 45 84 45 84 48C84 51 80.7222 51 80.7222 51H77.4444C77.4444 51 74.1667 51 74.1667 48C74.1667 45 77.4444 45 77.4444 45H80.7222ZM31.5556 45C31.5556 45 34.8333 45 34.8333 48C34.8333 51 31.5556 51 31.5556 51H28.2778C28.2778 51 25 51 25 48C25 45 28.2778 45 28.2778 45H31.5556ZM39.9483 31.9395C39.9483 31.9395 42.2657 34.0605 39.9483 36.1815C37.6309 38.3025 35.3135 36.1815 35.3135 36.1815L32.9945 34.062C32.9945 34.062 30.6771 31.941 32.9945 29.8185C35.3135 27.6975 37.6309 29.8185 37.6309 29.8185L39.9483 31.9395ZM74.365 63.4395C74.365 63.4395 76.6824 65.5605 74.365 67.6815C72.0476 69.8025 69.7302 67.6815 69.7302 67.6815L67.4128 65.5605C67.4128 65.5605 65.0954 63.4395 67.4128 61.3185C69.7302 59.1975 72.0476 61.3185 72.0476 61.3185L74.365 63.4395ZM73.6881 36.1815C73.6881 36.1815 71.3707 38.3025 69.0533 36.1815C66.7359 34.0605 69.0533 31.9395 69.0533 31.9395L71.3707 29.8185C71.3707 29.8185 73.6881 27.6975 76.0055 29.8185C78.3229 31.9395 76.0055 34.0605 76.0055 34.0605L73.6881 36.1815ZM39.2714 67.6815C39.2714 67.6815 36.9541 69.8025 34.6367 67.6815C32.3193 65.5605 34.6367 63.4395 34.6367 63.4395L36.9541 61.3185C36.9541 61.3185 39.2714 59.1975 41.5888 61.3185C43.9062 63.4395 41.5888 65.5605 41.5888 65.5605L39.2714 67.6815ZM51.2222 69C51.2222 69 51.2222 66 54.5 66C57.7778 66 57.7778 69 57.7778 69V72C57.7778 72 57.7778 75 54.5 75C51.2222 75 51.2222 72 51.2222 72V69Z" fill="#FFAC33"/>
            <path id="Vector_2" d="M54.5 63C63.5513 63 70.8889 56.2843 70.8889 48C70.8889 39.7157 63.5513 33 54.5 33C45.4487 33 38.1111 39.7157 38.1111 48C38.1111 56.2843 45.4487 63 54.5 63Z" fill="#FFAC33"/>
            </g>
            </g>
                    </svg>
</AnimationOnScroll>

          <a name="whitepaper"></a>
          <p></p>

          
        </div>
        <div className="footer"><Link to="/"><StyledLogo alt={"logo"} src={"/config/images/logo.png"}   /></Link></div>

        
       
       
     
    </s.Screen>
    

    
    </>
  );
}

export default App;
