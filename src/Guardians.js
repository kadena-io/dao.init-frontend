//basic React api imports
import React, { useState } from "react";
//Material Stuff
import {
  makeStyles,
} from '@material-ui/styles';
//pact-lang-api for blockchain calls
import Pact from "pact-lang-api";
//config file for blockchain calls
import { daoAPI } from "./kadena-config.js";
import {
  PactJsonListAsTable,
  MakeForm,
 } from "./util.js";

const useStyles = makeStyles(() => ({
  formControl: {
    margin: "5px auto",
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: "10px auto",
  },
}));


const sendGuardianCmd = async (
  setTx,
  setTxStatus,
  setTxRes,
  refresh,
  user, cmd, envData={}, caps=[]
) => {
    try {
      //creates transaction to send to wallet
      const toSign = {
          pactCode: cmd,
          caps: (Array.isArray(caps) && caps.length
            ? caps :
            Pact.lang.mkCap("Guadian Cap"
                           , "Authenticates that you're a guardian"
                           , `${daoAPI.contractAddress}.GUARDIAN`
                           , [user])),
          gasLimit: daoAPI.meta.gasLimit,
          chainId: daoAPI.meta.chainId,
          ttl: daoAPI.meta.ttl,
          sender: user,
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

      //sends signed transaction to blockchain
      const txReqKeys = await Pact.wallet.sendSigned(signed, daoAPI.meta.host)
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

export const RenderGuardians = (props) => {
  return (
    <PactJsonListAsTable
      header={["Guardian","Committed KDA","Approved Hash","Approval Date","Voting Guard","Forum Moderation Guard"]}
      keyOrder={["k","committed-kda","approved-hash","approved-date","guard","moderate-guard"]}
      json={props.guardians}
    />
)};

export const RegisterAmbassador = (props) => {
  const {
    refresh,
    guardians,
  } = props;
  const [grd, setGrd] = useState( "" );
  const [newAmb, setNewAmb] = useState( "" );
  const [ambGrd, setAmbGrd] = useState( "" );
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const inputFields = [
    {
      type:'select',
      label:'Select Guardian',
      className:classes.formControl,
      onChange:setGrd,
      options:guardians.map((g)=>g['k']),
    },
    {
      type:'textFieldSingle',
      label:'Ambassador Account Name',
      className:classes.formControl,
      value:newAmb,
      onChange:setNewAmb
    },
    {
      type:'textFieldMulti',
      label:'Ambassador Account Guard',
      className:classes.formControl,
      placeholder:JSON.stringify({"pred":"keys-all","keys":["8c59a322800b3650f9fc5b6742aa845bc1c35c2625dabfe5a9e9a4cada32c543"]},undefined,2),
      value:ambGrd,
      onChange:setAmbGrd,
    }
  ];

  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendGuardianCmd(setTx,setTxStatus,setTxRes,refresh
          ,grd
          ,`(${daoAPI.contractAddress}.register-ambassador "${grd}" "${newAmb}" (read-keyset 'ks))`
          ,{ks: JSON.parse(ambGrd)}
        );
      } catch (e) {
        console.log("Ambassador Registration Submit Error",typeof e, e, grd,newAmb,ambGrd);
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

export const DeactivateAmbassador = (props) => {
  const {refresh} = props;
  const [grd, setGrd] = useState( "" );
  const [amb, setAmb] = useState( "" );
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const handleSubmit = (evt) => {
      evt.preventDefault();
      // console.log(grd,newAmb);
      try {
        sendGuardianCmd(setTx,setTxStatus,setTxRes,refresh
        ,grd
        ,`(${daoAPI.contractAddress}.deactivate-ambassador "${grd}" "${amb}")`
        )
      } catch (e) {
        console.log("deactivate-ambassador Submit Error",typeof e, e, grd,);
        setTxRes(e);
        setTxStatus("validation-error");
      }
      };
  const inputFields = [
    {
      type:'select',
      label:'Select Guardian',
      className:classes.formControl,
      onChange:setGrd,
      options:props.guardians.map((g)=>g['k']),
    },
    {
      type:'select',
      label:'Select Ambassador',
      className:classes.formControl,
      onChange:setAmb,
      options:props.ambassadors.map((g)=>g['k']),
    },
  ];

  return (
    <MakeForm
      inputFields={inputFields}
      onSubmit={handleSubmit}
      tx={tx} txStatus={txStatus} txRes={txRes}
      setTxStatus={setTxStatus}/>
  );
};

export const ReactivateAmbassador = (props) => {
  const {
    refresh,
  } = props;
  const [grd, setGrd] = useState( "" );
  const [amb, setAmb] = useState( "" );
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const handleSubmit = (evt) => {
      evt.preventDefault();
      // console.log(grd,newAmb);
      try {
        sendGuardianCmd(setTx,setTxStatus,setTxRes,refresh
        ,grd
        ,`(${daoAPI.contractAddress}.reactivate-ambassador "${grd}" "${amb}")`
        )
      } catch (e) {
        console.log("reactivate-ambassador Submit Error",typeof e, e, grd,);
        setTxRes(e);
        setTxStatus("validation-error");
      }
    };
  const inputFields = [
    {
      type:'select',
      label:'Select Guardian',
      className:classes.formControl,
      onChange:setGrd,
      options:props.guardians.map((g)=>g['k']),
    },
    {
      type:'select',
      label:'Select Ambassador',
      className:classes.formControl,
      onChange:setAmb,
      options:props.ambassadors.map((g)=>g['k']),
    },
  ];

  return (
    <MakeForm
      inputFields={inputFields}
      onSubmit={handleSubmit}
      tx={tx} txStatus={txStatus} txRes={txRes}
      setTxStatus={setTxStatus}/>
  );
}

export const RotateGuardian = (props) => {
  const {
    refresh,
    guardians,
  } = props;
  const [grd, setGrd] = useState( "" );
  const [voteKs, setVoteKs] = useState( "" );
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const handleSubmit = (evt) => {
      evt.preventDefault();
      // console.log(grd,newAmb);
      try {
        sendGuardianCmd(setTx,setTxStatus,setTxRes,refresh
        ,grd
        ,`(${daoAPI.contractAddress}.rotate-guardian "${grd}" (read-keyset 'voteKs))`
        ,{voteKs: JSON.parse(voteKs)})
      } catch (e) {
        console.log("rotate-guardian Submit Error",typeof e, e, grd, voteKs,);
        setTxRes(e);
        setTxStatus("validation-error");
      }
    };

  const inputFields = [
    {
      type:'select',
      label:'Select Guardian',
      className:classes.formControl,
      onChange:setGrd,
      options:guardians.map((g)=>g['k']),
    },{
      type:'textFieldMulti',
      label:'Guardian Voting Guard',
      className:classes.formControl,
      placeholder:JSON.stringify({"pred":"keys-all","keys":["8c59a322800b3650f9fc5b6742aa845bc1c35c2625dabfe5a9e9a4cada32c543"]},undefined,2),
      value:voteKs,
      onChange:setVoteKs,
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

export const ProposeDaoUpgrade = (props) => {
  const {
    refresh,
    guardians,
  } = props;
  const [acct, setAcct] = useState( "" );
  const [hsh, setHsh] = useState( "" );
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const inputFields = [
    {
      type:'select',
      label:'Select Guardian',
      className:classes.formControl,
      onChange:setAcct,
      options:guardians.map((g)=>g['k']),
    },
    {
      type:'textFieldSingle',
      label:'Proposed Upgrade Hash',
      className:classes.formControl,
      value:hsh,
      onChange:setHsh
    }
  ];

  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendGuardianCmd(setTx,setTxStatus,setTxRes,refresh
          ,acct
          ,`(${daoAPI.contractAddress}.propose-dao-upgrade "${acct}" "${hsh}")`
        );
      } catch (e) {
        console.log("propose-dao-upgrade Submit Error",typeof e, e, acct,hsh,);
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

export const GuardianApproveHash = (props) => {
  const {
    refresh,
    guardians,
  } = props;
  const [acct, setAcct] = useState( "" );
  const [hsh, setHsh] = useState( "" );
  const {txStatus, setTxStatus,
         tx, setTx,
         txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const inputFields = [
    {
      type:'select',
      label:'Select Guardian',
      className:classes.formControl,
      onChange:setAcct,
      options:guardians.map((g)=>g['k']),
    },
    {
      type:'select',
      label:'Proposed Upgrade Hash',
      className:classes.formControl,
      value:setHsh,
      options:guardians.map((g)=>g['approved-hash']),
    }
  ];

  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendGuardianCmd(setTx,setTxStatus,setTxRes,refresh
          ,acct
          ,`(${daoAPI.contractAddress}.guardian-approve-hash "${acct}" "${hsh}")`
        );
      } catch (e) {
        console.log("guardian-approve-hash Submit Error",typeof e, e, acct,hsh,);
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

export const RegisterGuardian = (props) => {
  const {
    refresh,
  } = props;
  const [grd, setGrd] = useState( "" );
  const [voteKs, setVoteKs] = useState( "" );
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const inputFields = [
    {
      type:'textFieldSingle',
      label:'Guardian Account Name',
      className:classes.formControl,
      value:grd,
      onChange:setGrd
    },
    {
      type:'textFieldMulti',
      label:'Guardian Voting Guard',
      className:classes.formControl,
      placeholder:JSON.stringify({"pred":"keys-all","keys":["8c59a322800b3650f9fc5b6742aa845bc1c35c2625dabfe5a9e9a4cada32c543"]},undefined,2),
      value:voteKs,
      onChange:setVoteKs,
    }
  ];

  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendGuardianCmd(setTx,setTxStatus,setTxRes,refresh
          ,grd
          ,`(${daoAPI.contractAddress}.register-guardian "${grd}" (read-keyset 'voteKs))`
          ,{voteKs: JSON.parse(voteKs)}
          ,[Pact.lang.mkCap("TRANSFER Cap"
                           , "Stake the needed amount"
                           , `coin.TRANSFER`
                           , [grd, daoAPI.constants["DAO_ACCT_NAME"], daoAPI.constants["GUARDIAN_KDA_REQUIRED"]])]
        );
      } catch (e) {
        console.log("Guardian Registration Submit Error",typeof e, e, grd,voteKs);
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
