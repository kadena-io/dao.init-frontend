//basic React api imports
import React, { useState } from "react";
//Material Stuff
import {
  makeStyles,
} from '@material-ui/styles';
//pact-lang-api for blockchain calls
import Pact from "pact-lang-api";
//config file for blockchain calls
import { daoAPI } from "../kadena-config.js";
import { usePactWallet, addGasCap } from "../PactWallet.js";
import {
  PactJsonListAsTable,
  MakeForm,
 } from "../util.js";

const useStyles = makeStyles(() => ({
  formControl: {
    margin: "5px auto",
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: "10px auto",
  },
}));

export const RenderAmbassadors = (props) => {
  return (
    <PactJsonListAsTable
      header={["Ambassador","Active","Voted to Freeze","Guard"]}
      keyOrder={["k","active","voted-to-freeze","guard"]}
      json={props.ambassadors}
    />
)};

const sendAmbassadorCmd = async (
  setTx,
  setTxStatus,
  setTxRes,
  refresh,
  signingKey,
  networkId,
  gasPrice,
  user, cmd, envData={}, caps=[]
) => {
    try {
      //creates transaction to send to wallet
      const toSign = {
          pactCode: cmd,
          caps: addGasCap((Array.isArray(caps) && caps.length
            ? caps :
            Pact.lang.mkCap("Ambassador Cap"
                           , "Authenticates that you're an ambassador"
                           , `${daoAPI.contractAddress}.AMBASSADOR`
                           , [user]))),
          signingPubKey: signingKey,
          networkId: networkId,
          gasPrice: gasPrice,
          gasLimit: daoAPI.meta.gasLimit,
          chainId: daoAPI.meta.chainId,
          ttl: daoAPI.meta.ttl,
          sender: signingKey,
          envData: envData
      }
      console.log("toSign", toSign)
      //sends transaction to wallet to sign and awaits signed transaction
      const signed = await Pact.wallet.sign(toSign)
      console.log("signed", signed)
      setTx(signed)
      try {
      //sends signed transaction to blockchain
      const txReqKeys = await Pact.wallet.sendSigned(signed, daoAPI.meta.host)
      console.log("txReqKeys", txReqKeys)
      //set html to wait for transaction response
      //set state to wait for transaction response
      setTxStatus('pending')
        //listens to response to transaction sent
        //  note method will timeout in two minutes
        //    for lower level implementations checkout out Pact.fetch.poll() in pact-lang-api
        let retries = 8;
        let res = {};
        while (retries > 0) {
          //sleep the polling
          await new Promise(r => setTimeout(r, 15000));
          res = await Pact.fetch.poll(txReqKeys, daoAPI.meta.host);
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
          refresh();
        } else if (retries === 0) {
          console.log("tx status set to timeout");
          setTxStatus('timeout');
          refresh();
        } else {
          console.log("tx status set to failure");
          //set state for transaction failure
          setTxStatus('failure');
        }
      } catch(error) {
        // TODO: use break in the while loop to capture if timeout occured
        console.log("tx api failure", error, JSON.stringify(error, ["message", "arguments", "type", "name"]));
        setTxRes(error);
        setTxStatus('failure');
      }
    } catch(e) {
      console.log("tx status set to validation error",e);
      //set state for transaction construction error
      setTxStatus('validation-error');
    }
};

export const VoteToFreeze = (props) => {
  const {
    refresh,
    ambassadors,
  } = props;
  const {current: {signingKey, networkId, gasPrice}} = usePactWallet();
  const [amb, setAmb] = useState( "" );
  const {txStatus, setTxStatus,
         tx, setTx,
         txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const inputFields = [
    {
      type:'select',
      label:'Select Ambassador',
      className:classes.formControl,
      onChange:setAmb,
      options:ambassadors.map((g)=>g['k']),
    }
  ];

  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendAmbassadorCmd(setTx,setTxStatus,setTxRes,refresh
          ,signingKey, networkId, Number.parseFloat(gasPrice)
          ,amb
          ,`(${daoAPI.contractAddress}.vote-to-freeze "${amb}")`
        );
      } catch (e) {
        console.log("vote to freeze Submit Error",typeof e, e, amb);
        setTxRes(e);
        setTxStatus("validation-error");
      }
  };

  return (
    <MakeForm
      inputFields={inputFields}
      onSubmit={handleSubmit}
      tx={tx} txStatus={txStatus} txRes={txRes}
      setTxStatus={setTxStatus}/>
  )
};

export const Freeze = (props) => {
  const {
    refresh,
    ambassadors,
  } = props;
  const {current: {signingKey, networkId, gasPrice}} = usePactWallet();
  const [amb, setAmb] = useState( "" );
  const {txStatus, setTxStatus,
         tx, setTx,
         txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const inputFields = [
    {
      type:'select',
      label:'Select Ambassador',
      className:classes.formControl,
      onChange:setAmb,
      options:ambassadors.map((g)=>g['k']),
    }
  ];

  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendAmbassadorCmd(setTx,setTxStatus,setTxRes,refresh
          ,signingKey, networkId, Number.parseFloat(gasPrice)
          ,amb
          ,`(${daoAPI.contractAddress}.freeze "${amb}")`
        );
      } catch (e) {
        console.log("freeze Submit Error",typeof e, e, amb);
        setTxRes(e);
        setTxStatus("validation-error");
      }
  };

  return (
    <MakeForm
      inputFields={inputFields}
      onSubmit={handleSubmit}
      tx={tx} txStatus={txStatus} txRes={txRes}
      setTxStatus={setTxStatus}/>
  )
};

export const RotateAmbassador = (props) => {
  const {
    refresh,
    ambassadors,
  } = props;
  const {current: {signingKey, networkId, gasPrice}} = usePactWallet();
  const [acct, setAcct] = useState( "" );
  const [ks, setKs] = useState( "" );
  const {txStatus, setTxStatus,
         tx, setTx,
         txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const handleSubmit = (evt) => {
      evt.preventDefault();
      // console.log(grd,newAmb);
      try {
        sendAmbassadorCmd(setTx,setTxStatus,setTxRes,refresh
          ,signingKey, networkId, Number.parseFloat(gasPrice)
          ,acct
          ,`(${daoAPI.contractAddress}.rotate-ambassador "${acct}" (read-keyset 'ks))`
          ,{ks: JSON.parse(ks)})
      } catch (e) {
        console.log("rotate-ambassador Submit Error",typeof e, e, acct,ks);
        setTxRes(e);
        setTxStatus("validation-error");
      }
    };

  const inputFields = [
    {
      type:'select',
      label:'Select Ambassador',
      className:classes.formControl,
      onChange:setAcct,
      options:ambassadors.map((g)=>g['k']),
    },{
      type:'textFieldMulti',
      label:'Guardian Account Guard',
      className:classes.formControl,
      placeholder:JSON.stringify({"pred":"keys-all","keys":["8c59a322800b3650f9fc5b6742aa845bc1c35c2625dabfe5a9e9a4cada32c543"]},undefined,2),
      value:ks,
      onChange:setKs,
    }
  ];

  return (
    <MakeForm
      inputFields={inputFields}
      onSubmit={handleSubmit}
      tx={tx} txStatus={txStatus} txRes={txRes}
      setTxStatus={setTxStatus}/>
  );
};
