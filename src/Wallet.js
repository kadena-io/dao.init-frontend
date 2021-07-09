import React, { useState, useEffect, createContext, useContext, useCallback } from "react";
import createPersistedState from 'use-persisted-state';
import _ from 'lodash';

import {
  Button,
  ButtonGroup,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  ClickAwayListener,
  Collapse,
  Divider,
  Grid,
  Grow,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  makeStyles,
} from '@material-ui/styles';
import GavelIcon from '@material-ui/icons/Gavel';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
//pact-lang-api for blockchain calls
import Pact from "pact-lang-api";
//config file for blockchain calls
import {
  PactJsonListAsTable,
  PactSingleJsonAsTable,
  MakeInputField,
  updateParams,
  renderPactValue,
 } from "./util.js";

const useStyles = makeStyles(() => ({
  formControl: {
    margin: "5px auto",
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: "10px auto",
  },
  inline: {
    display: "inline",
  },
}));

const walletProvider = {
    wallet: "Chainweaver",
    signingKey: "",
    gasPrice:"0.00000000001",
    networkId:"testnet04",
};

export const WalletContext = createContext({
    walletProvider: walletProvider,
    setWalletProvider: () => {},
    pastPactTxs: [],
    setPastPactTxs: () => {},
});

export const useWalletProvider = (defaultObj) => {
    const {walletProvider, setWalletProvider} = useContext(WalletContext);
    useEffect(()=>
        setWalletProvider({...walletProvider, ...defaultObj})
    ,[]);
    const mergingSetter =  useCallback((newObj) => setWalletProvider({...walletProvider, ...newObj}),[walletProvider,setWalletProvider]);
    return [walletProvider, mergingSetter];
};

export const usePastPactTxs = () => {
    const {pastPactTxs, setPastPactTxs} = useContext(WalletContext);
    const trackNewPactTx =  useCallback((newPactTx) => setPastPactTxs([...pastPactTxs, newPactTx]) ,[pastPactTxs,setPastPactTxs]);
    return [walletProvider, trackNewPactTx];
};

export const Wallet = ({children}) => {
  //Wallet State
  const [persistedWallet,setPersistedWallet] = createPersistedState("wallet")({wallet: "Chainweaver"});
  const [walletProvider,setWalletProvider] = useState(persistedWallet);
  // Experimental wrapper for "emit" bug found in https://github.com/donavon/use-persisted-state/issues/56
  useEffect(()=>setPersistedWallet(walletProvider),[persistedWallet,walletProvider,setPersistedWallet]);

  const [persistedPactTxs,setPersistedPactTxs] = createPersistedState("pactTxs")();
  const [pastPactTxs,setPastPactTxs] = useState(persistedPactTxs);
  useEffect(()=>setPersistedPactTxs(pastPactTxs),[persistedPactTxs,pastPactTxs,setPersistedPactTxs]);

  return <WalletContext.Provider value={{
                walletProvider:walletProvider, 
                setWalletProvider:setWalletProvider,
                pastPactTxs:pastPactTxs,
                setPastPactTxs:setPastPactTxs,
                }}
                >
          {children}
      </WalletContext.Provider>
}

export const walletDrawerEntries = {
  primary:"Wallet",
  subList:
    [{
      primary:"Config",
      to:{app:"wallet", ui: "config"}
    }
  ]
};

export const WalletApp = ({
  appRoute, 
  setAppRoute,
}) => {

  return (
    appRoute.ui === "config" ?
    <Card>
      <CardHeader title="Wallet Configuration"/>
      <CardContent>
        <WalletConfig />
      </CardContent>
    </Card>
  : <React.Fragment>
      {setAppRoute({app:"wallet", ui:"config"})}
  </React.Fragment>
  )
};

export const WalletConfig = () => {
  const [walletProvider, setWalletProvider] = useWalletProvider();
  const [saved,setSaved] = useState(false);
  const [wallet,setWallet] = useState("Chainweaver");
  const [signingKey, setSigningKey] = useState("");
  const [networkId, setNetworkId] = useState("testnet04");
  const [gasPrice, setGasPrice] = useState("0.00000000001");
  const classes = useStyles();

  useEffect(()=> {
    console.log("WalletConfig useEffect on load fired with", walletProvider)
    if (_.size(walletProvider)) {
        setWallet(walletProvider.wallet);
        setSigningKey(walletProvider.signingKey);
        setGasPrice(walletProvider.setGasPrice);
        setNetworkId(walletProvider.networkId);
        setSaved(true);
    } 
  }
  ,[]);

  useEffect(()=>setSaved(false),[wallet,signingKey,gasPrice,networkId]);

  const handleSubmit = (evt) => {
      evt.preventDefault();
      const n = {wallet:wallet, signingKey:signingKey, gasPrice:gasPrice, networkId:networkId};
      setWalletProvider(n);
      setSaved(true);
      console.log("WalletConfig set to", n)
  };
  const inputFields = [
    {
      type:'select',
      label:'Wallet',
      className:classes.formControl,
      onChange:setWallet,
      value:wallet,
      options:["Chainweaver", "Zelcore"],
    },{
      type:'select',
      label:'Network',
      className:classes.formControl,
      onChange:setNetworkId,
      value:networkId,
      options:["testnet04", "mainnet01"],
    },{
      type:'textFieldSingle',
      label:'Signing Key',
      className:classes.formControl,
      placeholder:"c4a3024ab01c3b802a388b5ae69aa0893f28a4b64c812756778c2e6982a94ec8",
      value:signingKey,
      onChange:setSigningKey,
    },{
      type:'textFieldSingle',
      label:'Gas Price',
      className:classes.formControl,
      value:gasPrice,
      onChange:setGasPrice,
    }];

  return <div>
      <form
        autoComplete="off"
        onSubmit={(evt) => handleSubmit(evt)}>
        {inputFields.map(f =>
          <MakeInputField inputField={f}/>
        )}
        <CardActions>
            <Button variant="outlined" color="default" type="submit" disabled={saved}>
                {saved ? "Current Settings" : "Save New Settings" }
            </Button>
        </CardActions>
      </form>
    </div>
};