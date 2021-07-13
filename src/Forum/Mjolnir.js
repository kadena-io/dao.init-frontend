//basic React api imports
import React, { useState } from "react";
//Material Stuff
import {
  makeStyles,
} from '@material-ui/styles';
//pact-lang-api for blockchain calls
import Pact from "pact-lang-api";
//config file for blockchain calls
import { forumAPI } from "../kadena-config.js";
import {
  PactJsonListAsTable,
  MakeForm,
 } from "../util.js";
import { ScrollableTabs } from "../ScrollableTabs.js";
import { useWallet, addGasCap } from "../Wallet.js";

const useStyles = makeStyles(() => ({
  formControl: {
    margin: "5px auto",
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: "10px auto",
  },
}));


const sendMjolnirCmd = async (
  setTx,
  setTxStatus,
  setTxRes,
  refresh,
  signingKey,
  networkId,
  gasPrice,
  cmd, envData={}, caps=[]
) => {
    try {
      //creates transaction to send to wallet
      const toSign = {
          pactCode: cmd,
          caps: addGasCap(Array.isArray(caps) && caps.length
            ? caps :
            Pact.lang.mkCap("Mjonlir Cap"
                           , "Authenticates that you're Mjonir"
                           , `${forumAPI.contractAddress}.MJOLNIR`)),
          signingPubKey: signingKey,
          networkId: networkId,
          gasPrice: gasPrice,
          gasLimit: forumAPI.meta.gasLimit,
          chainId: forumAPI.meta.chainId,
          sender: signingKey,
          ttl: forumAPI.meta.ttl,
          envData: envData
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

      try {
      //sends signed transaction to blockchain
      const txReqKeys = await Pact.wallet.sendSigned(signed, forumAPI.meta.host)
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
          res = await Pact.fetch.poll(txReqKeys, forumAPI.meta.host);
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
      } catch(e) {
        // TODO: use break in the while loop to capture if timeout occured
        console.log("tx api failure",e);
        setTxRes(e);
        setTxStatus('failure');
      }
    } catch(e) {
      console.log("tx status set to validation error",e);
      //set state for transaction construction error
      setTxStatus('validation-error');
    }
};

const RotateMjolnir = (props) => {
  const {
    refresh,
  } = props;
  const {current: {signingKey, networkId, gasPrice}} = useWallet();
  const [newGrd, setNewGrd] = useState( "" );
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const inputFields = [
    {
      type:'textFieldMulti',
      label:'New Mjolnir Guard',
      className:classes.formControl,
      placeholder:JSON.stringify({"pred":"keys-all","keys":["8c59a322800b3650f9fc5b6742aa845bc1c35c2625dabfe5a9e9a4cada32c543"]},undefined,2),
      value:newGrd,
      onChange:setNewGrd,
    }
  ];

  const handleSubmit = (evt) => {
      evt.preventDefault();
      console.log(forumAPI);
      try {
        sendMjolnirCmd(setTx,setTxStatus,setTxRes,refresh
          ,signingKey, networkId, Number.parseFloat(gasPrice)
          ,`(${forumAPI.contractAddress}.rotate-mjolnir (read-keyset 'ks))`
          ,{ks: JSON.parse(newGrd)}
        );
      } catch (e) {
        console.log("Mjonir Registration Submit Error",typeof e, e, newGrd);
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

export const DisableModerator = (props) => {
  const {refresh, moderators} = props;
  const {current: {signingKey, networkId, gasPrice}} = useWallet();
  const [mod, setMod] = useState( "" );
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMjolnirCmd(setTx,setTxStatus,setTxRes,refresh
          ,signingKey, networkId, Number.parseFloat(gasPrice)
        ,`(${forumAPI.contractAddress}.disable-moderator "${mod}")`
        )
      } catch (e) {
        console.log("disable-moderator Submit Error",typeof e, e, mod,);
        setTxRes(e);
        setTxStatus("validation-error");
      }
      };
  const inputFields = [
    {
      type:'select',
      label:'Select Moderator',
      className:classes.formControl,
      onChange:setMod,
      options:moderators.map((g)=>g['name']),
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

const EnableModerator = (props) => {
  const {refresh, moderators} = props;
  const {current: {signingKey, networkId, gasPrice}} = useWallet();
  const [mod, setMod] = useState( "" );
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMjolnirCmd(setTx,setTxStatus,setTxRes,refresh
          ,signingKey, networkId, Number.parseFloat(gasPrice)
          ,`(${forumAPI.contractAddress}.enable-moderator "${mod}")`
        )
      } catch (e) {
        console.log("disable-moderator Submit Error",typeof e, e, mod,);
        setTxRes(e);
        setTxStatus("validation-error");
      }
      };
  const inputFields = [
    {
      type:'select',
      label:'Select Moderator',
      className:classes.formControl,
      onChange:setMod,
      options:moderators.map((g)=>g['name']),
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

const MjolnirWriteMember = (props) => {
  const {refresh, moderators, members} = props;
  const {current: {signingKey, networkId, gasPrice}} = useWallet();
  const [user, setUser] = useState( "" );
  const [newKs, setNewKs] = useState({});
  const [isMod,setIsMod] = useState(false);
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMjolnirCmd(setTx,setTxStatus,setTxRes,refresh
          ,signingKey, networkId, Number.parseFloat(gasPrice)
          ,`(${forumAPI.contractAddress}.mjolnir-write-member "${user}" (read-keyset 'ks) ${isMod})`
          ,{ks: JSON.parse(newKs)})
      } catch (e) {
        console.log("mjolnir-write-member Submit Error",typeof e, e, user, newKs, isMod);
        setTxRes(e);
        setTxStatus("validation-error");
      }
      };
  const inputFields = [
    {
      type:'select',
      label:'Select User',
      className:classes.formControl,
      onChange:setUser,
      options:moderators.map(g=>g.name).concat(members.map(m=>m.name)),
    },{
      type:'textFieldMulti',
      label:'New Guard',
      className:classes.formControl,
      placeholder:JSON.stringify({"pred":"keys-all","keys":["8c59a322800b3650f9fc5b6742aa845bc1c35c2625dabfe5a9e9a4cada32c543"]},undefined,2),
      value:newKs,
      onChange:setNewKs,
    },{
      type:'checkbox',
      label:'Moderator',
      className:classes.formControl,
      value:isMod,
      onChange:setIsMod,
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

export const MjolnirActionForms = (props) => {
  const {
    members,
    moderators,
    tabIdx,
    pactTxStatus,
  } = props;
  const {
    getForumState,
    getMembers,
  } = props.refresh;

  return (
    <ScrollableTabs
      tabIdx={tabIdx}
      tabEntries={[
          {
            label:"Rotate Mjolnir Guard",
            component:
              <RotateMjolnir
                pactTxStatus={pactTxStatus}
                refresh={()=>getForumState()}/>
          },{
            label:"Enable Moderator",
            component:
              <EnableModerator
                pactTxStatus={pactTxStatus}
                moderators={moderators}
                refresh={() => getMembers()}/>
          },{
            label:"Disable Moderator",
            component:
              <DisableModerator
                pactTxStatus={pactTxStatus}
                moderators={moderators}
                refresh={() => getMembers()}/>
          },{
            label:"Mjolnir Write Member",
            component:
              <MjolnirWriteMember
                pactTxStatus={pactTxStatus}
                moderators={moderators}
                members={members}
                refresh={() => getMembers()}/>
          }
      ]}/>
  );
}