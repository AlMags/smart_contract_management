import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit();
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw();
      await tx.wait()
      getBalance();
    }
  }

  const customWithdraw =  async(amount) => {
    if(atm){
      let tx = await atm.specifiedWithdraw(amount);
      await tx.wait()
      getBalance();
    }
  }

  const customDeposit = async(amount) => {
    if(atm){
      let tx = await atm.specifiedDeposit(amount);
      await tx.wait()
      getBalance();
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }
    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>

        <div style={{width: '50%', height: '50px', display: 'inline-block',}}>
          <button className="deposit-button" onClick={deposit}
          style={{
            color: 'white',
            backgroundColor: '#AEDEFC',
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer',
            margin: '10px',
            borderRadius: '25px',
            display: 'block',
            margin: 'auto',
            fontSize: '20px',
            }}>
            Deposit 1 ETH
          </button>
        </div>

        <div style={{width: '50%', height: '50px', display: 'inline-block',}}>
          <button className="withdraw-button" onClick={withdraw}
          style={{
            color: 'white',
            backgroundColor: '#AEDEFC',
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer',
            margin: '10px',
            borderRadius: '25px',
            display: 'block',
            margin: 'auto',
            fontSize: '20px',
            }}>Withdraw 1 ETH</button>
        </div>

        <div style={{width: '100%', height: '30px', display: 'inline-block',}}>
          <input
            type = "number"
            placeholder= "Enter an amount here"
            id = "specifiedDepositAmount"
          />
        </div>

        <div style={{width: '100%', height: '50px', display: 'inline-block',}}>
          <button className="deposit-amount-button" 
            onClick={() => {
              const specifiedAmount = document.getElementById("specifiedDepositAmount").value;
              customDeposit(parseInt(specifiedAmount, 10));
            }}
            style={{
              color: 'white',
              backgroundColor: '#AEDEFC',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              margin: '10px',
              borderRadius: '25px',
              display: 'block',
              margin: 'auto',
              fontSize: '20px',
              }}>Enter Deposit Amount</button>
        </div>

        <div style={{width: '100%', height: '30px', display: 'inline-block',}}>
          <input
            type = "number"
            placeholder= "Enter an amount here"
            id = "specifiedWithdraweAmount"
          />
        </div>

        <div style={{width: '100%', height: '50px', display: 'inline-block',}}>

          <button className="withdraw-amount-button" 
          onClick={() => {
            const specifiedAmount = document.getElementById("specifiedWithdraweAmount").value;
            customWithdraw(parseInt(specifiedAmount, 10));
          }}

          style={{
            color: 'white',
            backgroundColor: '#AEDEFC',
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer',
            margin: '10px',
            borderRadius: '25px',
            display: 'block',
            margin: 'auto',
            fontSize: '20px',
            }}>Enter Withdrawal Amount</button>
        </div>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
      <main className="container">
        <header><h1>Welcome to the Metacrafters ATM!</h1></header>
        {initUser()}
        <style jsx>{`
          h1{
              font-family: Arial;
              font-size: 72px; 
              font-weight: bold;
              color: #FFFFFF; 
          }
          .container {
            border-radius: 25px;
            background-color: #FFE5BE;
            font-family: system-ui;
            font-kerning: auto;
            width: 80%;
            text-align: center;
            margin: auto auto;
            padding: 20px 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
        `}
        </style>
      </main>
  )
}
