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
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import GavelIcon from '@material-ui/icons/Gavel';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
//pact-lang-api for blockchain calls
import Pact from "pact-lang-api";
//config file for blockchain calls
import { PactTxStatus } from "./PactTxStatus.js";
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

const walletProviderDefault = {
    wallet: "Chainweaver",
    signingKey: "",
    gasPrice:"0.00000000001",
    networkId:"testnet04",
};

export const WalletContext = createContext({
    walletProvider: walletProviderDefault,
    setWalletProvider: () => {},
    allKeys:[],
    setAllKeys:() => {},
    otherWallets:[],
    setOtherWallets:() => {},
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

export const useSigningKeys = () => {
    const {walletProvider, setWalletProvider} = useContext(WalletContext);
    const allKeys = walletProvider["signingKeys"];
    const addNewKey = useCallback((newKey) => setWalletProvider({...walletProvider, signingKeys: _.filter(_.uniq(_.concat(allKeys,newKey)), v=>v?true:false)})
      ,[setWalletProvider,allKeys,walletProvider]);
    return [allKeys, addNewKey];
}

export const usePastPactTxs = () => {
    const {pastPactTxs, setPastPactTxs} = useContext(WalletContext);
    const trackNewPactTx =  useCallback((newPactTx) => setPastPactTxs([...pastPactTxs, newPactTx]) ,[pastPactTxs,setPastPactTxs]);
    return [pastPactTxs, trackNewPactTx];
};

export const Wallet = ({children}) => {
  //Wallet State
  const [persistedWallet,setPersistedWallet] = createPersistedState("wallet")(walletProviderDefault);
  const [walletProvider,setWalletProvider] = useState(persistedWallet);
  // Experimental wrapper for "emit" bug found in https://github.com/donavon/use-persisted-state/issues/56
  useEffect(()=>setPersistedWallet(walletProvider),[persistedWallet,walletProvider,setPersistedWallet]);

  const [persistedAllKeys,setPersistedAllKeys] = createPersistedState("allKeys")([]);
  const [allKeys,setAllKeys] = useState(persistedAllKeys);
  useEffect(()=>setPersistedAllKeys(allKeys),[persistedAllKeys,allKeys,setPersistedAllKeys]);

  const [persistedPactTxs,setPersistedPactTxs] = createPersistedState("pactTxs")([]);
  const [pastPactTxs,setPastPactTxs] = useState(persistedPactTxs);
  useEffect(()=>setPersistedPactTxs(pastPactTxs),[persistedPactTxs,pastPactTxs,setPersistedPactTxs]);

  return <WalletContext.Provider value={{
                walletProvider:walletProvider, 
                setWalletProvider:setWalletProvider,
                allKeys:allKeys,
                setAllKeys:setAllKeys,
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

const walletCmd = async (
  setTx,
  setTxStatus,
  setTxRes,
  user, 
  signingPubKey, 
  networkId,
  gasPrice,
  host
) => {
    try {
      //creates transaction to send to wallet
      const toSign = {
          pactCode: "(+ 1 1)",
          caps: [
            Pact.lang.mkCap("Gas Cap"
                           , "Gas Cap"
                           , "coin.GAS"
                           , [])
          ],
          gasLimit: 1000,
          gasPrice: gasPrice,
          chainId: "0",
          signingPubKey: signingPubKey,
          networkId: networkId,
          ttl: 28800,
          sender: user,
          envData: {foo: "bar"}
      }
      console.log("toSign", toSign)
      //sends transaction to wallet to sign and awaits signed transaction
      const signed = await Pact.wallet.sign(toSign)
      console.log("signed", signed)
      if ( typeof signed === 'object' && 'hash' in signed ) {
        setTx(signed);
      } else {
        throw new Error("Signing API Failed");
      }

      //sends signed transaction to blockchain
      const txReqKeys = await Pact.wallet.sendSigned(signed, host)
      console.log("txReqKeys", txReqKeys)
      //set html to wait for transaction response
      //set state to wait for transaction response
      setTxStatus('pending')
      try {
        //listens to response to transaction sent
        //  note method will timeout in two minutes
        //    for lower level implementations checkout out Pact.fetch.poll() in pact-lang-api
        let retries = 8;
        let res = {};
        while (retries > 0) {
          //sleep the polling
          await new Promise(r => setTimeout(r, 15000));
          res = await Pact.fetch.poll(txReqKeys, host);
          try {
            if (res[signed.hash].result.status) {
              retries = -1;
            } else {
              retries = retries - 1;
            }
          } catch(e) {
              retries = retries - 1;
          }
        };
        //keep transaction response in local state
        setTxRes(res)
        if (res[signed.hash].result.status === "success"){
          console.log("tx status set to success");
          //set state for transaction success
          setTxStatus('success');
        } else if (retries === 0) {
          console.log("tx status set to timeout");
          setTxStatus('timeout');
        } else {
          console.log("tx status set to failure");
          //set state for transaction failure
          setTxStatus('failure');
        }
      } catch(e) {
        // TODO: use break in the while loop to capture if timeout occured
        console.log("tx api failure",e);
        setTxRes(e);
        setTxStatus('failure');
      }
    } catch(e) {
      setTxRes(e.toString());
      console.log("tx status set to validation error",e);
      //set state for transaction construction error
      setTxStatus('validation-error');
    }
};

const filter = createFilterOptions();

const SigningKeySelect = ({signingKey, setSigningKey, allKeys}) => {
  const classes = useStyles();
  let localOptions = allKeys ? _.clone(allKeys) : [""];

  return (
    <Autocomplete
      className={classes.formControl}
      value={signingKey}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setSigningKey(newValue);
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setSigningKey(newValue.inputValue)
        } else {
          setSigningKey(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        // Suggest the creation of a new value
        if (params.inputValue !== '') {
          filtered.push({
            inputValue: params.inputValue,
            title: `Add "${params.inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      fullWidth
      clearOnBlur
      handleHomeEndKeys
      defaultValue={signingKey ? signingKey : null}
      options={localOptions}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        } else {
          // Regular option
          return option;
        }
      }}
      renderOption={(option) => option.title ? option.title : option}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label="Select Signing Key" variant="outlined" fullWidth />
      )}
    />
  );
}


export const WalletConfig = () => {
  const [walletProvider, setWalletProvider] = useWalletProvider();
  const [allKeys, addNewKey] = useSigningKeys();
  const [saved,setSaved] = useState(false);
  const [wallet,setWallet] = useState("Chainweaver");
  const [signingKey, setSigningKey] = useState("");
  const [networkId, setNetworkId] = useState("testnet04");
  const [gasPrice, setGasPrice] = useState("");
  const classes = useStyles();

  const [txStatus, setTxStatus] = useState("");
  const [tx, setTx] = useState({});
  const [txRes, setTxRes] = useState({});

  useEffect(()=> {
    console.log("WalletConfig useEffect on load fired with", walletProvider)
    if (_.size(walletProvider)) {
        if (walletProvider.wallet) {setWallet(walletProvider.wallet)}
        if (walletProvider.signingKey) {setSigningKey(walletProvider.signingKey)}
        if (walletProvider.gasPrice) {setGasPrice(walletProvider.gasPrice)}
        if (walletProvider.networkId) {setNetworkId(walletProvider.networkId)}
    } 
  }
  ,[]);

  useEffect(()=>setSaved(false),[wallet,signingKey,gasPrice,networkId]);

  const handleSubmit = (evt) => {
      evt.preventDefault();
      if (saved) {
        const host = networkId === "testnet04" ? 
          `https://api.testnet.chainweb.com/chainweb/0.0/${networkId}/chain/0/pact` : 
          `https://api.chainweb.com/chainweb/0.0/${networkId}/chain/0/pact`; 
        walletCmd(
          setTx,
          setTxStatus,
          setTxRes,
          signingKey,
          signingKey, 
          networkId,
          Number.parseFloat(gasPrice), 
          host);
      } else {
        const n = {wallet:wallet, signingKey:signingKey, gasPrice:gasPrice, networkId:networkId};
        setWalletProvider(n);
        addNewKey(signingKey);
        setSaved(true);
        console.log("WalletConfig set to", n)
      }
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
        <SigningKeySelect signingKey={signingKey} setSigningKey={setSigningKey} allKeys={allKeys}/>
        <CardActions>
            <Button variant="outlined" color="default" type="submit">
                {saved ? "Test Current Settings" : "Save New Settings" }
            </Button>
        </CardActions>
      </form>
      { txStatus === 'pending' ? <LinearProgress /> : null }
      <PactTxStatus tx={tx} txRes={txRes} txStatus={txStatus} setTxStatus={setTxStatus}/>
    </div>
};