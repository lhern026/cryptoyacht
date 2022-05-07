import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { Canvas, useFrame } from '@react-three/fiber'
import { slide as Menu } from 'react-burger-menu'








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
  color: var(--secondary);
  text-decoration: none;
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
        window.open("https://metamask.app.link/dapp/cryptoyacht.vercel.app/")
       
      
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
    
    <s.Screen>
      <Menu stack>
      <a href="#"><img src={"/config/images/logo.png"} width="75" height={35}></img></a>
      <a href="#roadmap" className="menu-item">Roadmap</a>
      <a href="#faq" className="menu-item">Faq</a>
      <a href="#whitepaper" className="menu-item">Whitepaper</a>
      <a href="https://discord.com/" target="_blank"><img src="https://i.pinimg.com/564x/cf/64/fc/cf64fcce5cc8296544516488631ad676.jpg" width="35" height="35"></img></a>
      <a href="https://www.instagram.com/?hl=en" target="_blank"><img src="https://i.pinimg.com/originals/36/77/7f/36777f93ecf8062a887a748c3dfeac31.jpg" width="45" height="45"></img></a>
        </Menu>
      
     
      
  
      <s.Container
        
        ai={"center"}
   
        
      >
        <div className="header">
          <StyledLogo alt={"logo"} src={"/config/images/logo.png"}   />
        </div>
        <s.SpacerSmall />
          
        
        
        <ResponsiveWrapper flex={1} style={{ padding: 2 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"} style={{width : 100}} >
           
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px solid var(--secondary)",
              boxShadow: "0px 5px 11px 2px var(--primary)",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
               
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",

                
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Excluding gas fees.
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton  onClick={(e) => {
                        e.preventDefault();
                        openWindow();
                    
                        
                        
                      }}>open metamask (mobile only)</StyledButton>
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                    
                        dispatch(connect());
                        getData();
                        
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "BUY"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg
              alt={"example"}
              src={"/config/images/example.gif"}
              style={{ transform: "scaleX(-1)" }}
            />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
        <div>
        
        
        </div>
        <div className="text">
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              backdropFilter: "blur(20px)"
            }}
          >
            Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
          
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
            successfully mint your NFT. We recommend that you don't lower the
            gas limit.
          </s.TextDescription>
          </div>
        </s.Container>
      </s.Container>
   
        <div className="about"> 
            
            <button className="buttons"><span>CRYPTO</span> <span class="emphasis">YACHT CLUB</span></button>

    <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>
            
        
        
        </div>
        <div>
        <button className="buttons"> <span class="emphasis">ROAD MAP</span></button>
          <a name="roadmap"></a>
          <div class="timeline">
  <div class="container left">
   
    <i class="icon fa fa-home"></i>
    <div class="content">
      <h2>Phase 1</h2>
      <p>
        Lorem ipsum dolor sit amet elit. Aliquam odio dolor, id luctus erat sagittis non. Ut blandit semper pretium.
      </p>
    </div>
  </div>
  <div class="container right">

    <i class="icon fa fa-gift"></i>
    <div class="content">
      <h2>Phase 2</h2>
      <p>
        Lorem ipsum dolor sit amet elit. Aliquam odio dolor, id luctus erat sagittis non. Ut blandit semper pretium.
      </p>
    </div>
  </div>
  <div class="container left">
   
    <i class="icon fa fa-user"></i>
    <div class="content">
      <h2>Phase 3</h2>
      <p>
        Lorem ipsum dolor sit amet elit. Aliquam odio dolor, id luctus erat sagittis non. Ut blandit semper pretium.
      </p>
    </div>
  </div>
  <div class="container right">
   
    <i class="icon fa fa-running"></i>
    <div class="content">
      <h2>Phase 4</h2>
      <p>
        Lorem ipsum dolor sit amet elit. Aliquam odio dolor, id luctus erat sagittis non. Ut blandit semper pretium.
      </p>
    </div>
  </div>
  <div class="container left">
    
    <i class="icon fa fa-cog"></i>
    <div class="content">
      <h2>Phase 5</h2>
      <p>
        Lorem ipsum dolor sit amet elit. Aliquam odio dolor, id luctus erat sagittis non. Ut blandit semper pretium.
      </p>
    </div>
  </div>
  <div class="container right">
    
    <i class="icon fa fa-certificate"></i>
    <div class="content">
      <h2>Phase 6</h2>
      <p>
        Lorem ipsum dolor sit amet elit. Aliquam odio dolor, id luctus erat sagittis non. Ut blandit semper pretium.
      </p>
      
          </div>
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

          <a name="whitepaper"></a>
          <p></p>

          
        </div>

        
       
       
     
    </s.Screen>
    
    
  );
}

export default App;
