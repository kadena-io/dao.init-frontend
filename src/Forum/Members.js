//basic React api imports
import React, { useState } from "react";
//Material Stuff
import {
  makeStyles,
} from '@material-ui/styles';
//pact-lang-api for blockchain calls
import Pact from "pact-lang-api";
//config file for blockchain calls
import { daoAPI, forumAPI } from "../kadena-config.js";
import {
  PactJsonListAsTable,
  MakeForm,
 } from "../util.js";
import { ScrollableTabs } from "../ScrollableTabs.js";

const useStyles = makeStyles(() => ({
  formControl: {
    margin: "5px auto",
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: "10px auto",
  },
}));

export const RenderMembers = (props) => {
  return (
    <PactJsonListAsTable
      header={["Name","Disabled","Guard"]}
      keyOrder={["name","disabled","guard"]}
      json={props.members}
    />
)};

export const RenderModerators = (props) => {
  return (
    <PactJsonListAsTable
      header={["Name","Disabled","Guard"]}
      keyOrder={["name","disabled","guard"]}
      json={props.moderators}
    />
)};

export const sendMemberCmd = async (
  setTx,
  setTxStatus,
  setTxRes,
  refresh,
  user,
  cmd, envData={}, role="member", caps=[]
) => {
    try {
      //creates transaction to send to wallet
      const toSign = {
          pactCode: cmd,
          caps: (
            Array.isArray(caps) && caps.length ?
              caps :
            role === "moderator" ?
              Pact.lang.mkCap("MODERATOR Cap"
                            , "Authenticates that you're a MODERATOR"
                            , `${forumAPI.contractAddress}.MODERATOR`
                            , [user]) :
            role === "member" ? 
              Pact.lang.mkCap("MEMBER Cap"
              , "Authenticates that you're a MEMBER"
              , `${forumAPI.contractAddress}.MEMBER`
              , [user]) 
            : Error(`sendForumCmd(role=["member"|"moderator"]), got role=${role}`)),
          gasLimit: forumAPI.meta.gasLimit,
          chainId: forumAPI.meta.chainId,
          ttl: forumAPI.meta.ttl,
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
      const txReqKeys = await Pact.wallet.sendSigned(signed, forumAPI.meta.host)
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

const BecomeModerator = (props) => {
  const {refresh, guardians} = props;
  const [user, setUser] = useState( "" );
  const [newKs, setNewKs] = useState({});
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMemberCmd(setTx,setTxStatus,setTxRes,refresh
          ,user
          ,`(${forumAPI.contractAddress}.become-moderator "${user}" (read-keyset 'ks))`
          ,{ks: JSON.parse(newKs)}
          ,"moderator"
          ,[Pact.lang.mkCap("GUARDIAN Cap"
            , "Authenticates that you're a GUARDIAN"
            , `${daoAPI.contractAddress}.GUARDIAN`
            , [user])]);
      } catch (e) {
        console.log("mjolnir-write-member Submit Error",typeof e, e, user, newKs);
        setTxRes(e);
        setTxStatus("validation-error");
      }
      };
  const inputFields = [
    {
      type:'select',
      label:'Select your Guardian Account',
      className:classes.formControl,
      onChange:setUser,
      options:guardians.map((g)=>g['k']),
    },{
      type:'textFieldMulti',
      label:'Moderator Keyset',
      className:classes.formControl,
      placeholder:JSON.stringify({"pred":"keys-all","keys":["8c59a322800b3650f9fc5b6742aa845bc1c35c2625dabfe5a9e9a4cada32c543"]},undefined,2),
      value:newKs,
      onChange:setNewKs,
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

const BecomeMember = (props) => {
  const {refresh, ambassadors} = props;
  const [user, setUser] = useState( "" );
  const [newKs, setNewKs] = useState({});
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMemberCmd(setTx,setTxStatus,setTxRes,refresh
          ,user
          ,`(${forumAPI.contractAddress}.become-member "${user}" (read-keyset 'ks))`
          ,{ks: JSON.parse(newKs)}
          ,"member"
          ,[Pact.lang.mkCap("AMBASSADOR Cap"
            , "Authenticates that you're a AMBASSADOR"
            , `${daoAPI.contractAddress}.AMBASSADOR`
            , [user])] 
        );
      } catch (e) {
        console.log("mjolnir-write-member Submit Error",typeof e, e, user, newKs);
        setTxRes(e);
        setTxStatus("validation-error");
      }
      };
  const inputFields = [
    {
      type:'select',
      label:'Select your Ambassador Account',
      className:classes.formControl,
      onChange:setUser,
      options:ambassadors.map((g)=>g['k']),
    },{
      type:'textFieldMulti',
      label:'Member Keyset',
      className:classes.formControl,
      placeholder:JSON.stringify({"pred":"keys-all","keys":["8c59a322800b3650f9fc5b6742aa845bc1c35c2625dabfe5a9e9a4cada32c543"]},undefined,2),
      value:newKs,
      onChange:setNewKs,
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

const DisableMember = (props) => {
  const {refresh, moderators, members} = props;
  const [mod, setMod] = useState( "" );
  const [member, setMember] = useState( "" );
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMemberCmd(setTx,setTxStatus,setTxRes,refresh
          ,mod
          ,`(${forumAPI.contractAddress}.disable-member "${mod}" "${member}")`
          ,{}
          ,"moderator" 
        );
      } catch (e) {
        console.log("disable-member Submit Error",typeof e, e, mod, member);
        setTxRes(e);
        setTxStatus("validation-error");
      }
      };
  const inputFields = [
    {
      type:'select',
      label:'Select your Moderator Account',
      className:classes.formControl,
      onChange:setMod,
      options:moderators.map((m)=>m['name']),
    },{
      type:'select',
      label:'Select Member Account',
      className:classes.formControl,
      onChange:setMember,
      options:members.map((m)=>m['name']),
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


const EnableMember = (props) => {
  const {refresh, moderators, members} = props;
  const [mod, setMod] = useState( "" );
  const [member, setMember] = useState( "" );
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMemberCmd(setTx,setTxStatus,setTxRes,refresh
          ,mod
          ,`(${forumAPI.contractAddress}.enable-member "${mod}" "${member}")`
          ,{}
          ,"moderator" 
        );
      } catch (e) {
        console.log("enable-member Submit Error",typeof e, e, mod, member);
        setTxRes(e);
        setTxStatus("validation-error");
      }
      };
  const inputFields = [
    {
      type:'select',
      label:'Select your Moderator Account',
      className:classes.formControl,
      onChange:setMod,
      options:moderators.map((m)=>m['name']),
    },{
      type:'select',
      label:'Select Member Account',
      className:classes.formControl,
      onChange:setMember,
      options:members.map((m)=>m['name']),
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

const RotateModerator = (props) => {
  const {refresh, moderators} = props;
  const [mod, setMod] = useState( "" );
  const [newKs, setNewKs] = useState( {} );
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMemberCmd(setTx,setTxStatus,setTxRes,refresh
          ,mod
          ,`(${forumAPI.contractAddress}.rotate-moderator "${mod}" (read-keyset 'ks))`
          ,{ks: JSON.parse(newKs)}
          ,"moderator" 
        );
      } catch (e) {
        console.log("rotate-moderator Submit Error",typeof e, e, mod, newKs);
        setTxRes(e);
        setTxStatus("validation-error");
      }
      };
  const inputFields = [
    {
      type:'select',
      label:'Select your Moderator Account',
      className:classes.formControl,
      onChange:setMod,
      options:moderators.map((m)=>m['name']),
    },{
      type:'textFieldMulti',
      label:'New Keyset',
      className:classes.formControl,
      placeholder:JSON.stringify({"pred":"keys-all","keys":["8c59a322800b3650f9fc5b6742aa845bc1c35c2625dabfe5a9e9a4cada32c543"]},undefined,2),
      value:newKs,
      onChange:setNewKs,
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

const RotateMember = (props) => {
  const {refresh, members} = props;
  const [member, setMember] = useState( "" );
  const [newKs, setNewKs] = useState( {} );
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMemberCmd(setTx,setTxStatus,setTxRes,refresh
          ,member
          ,`(${forumAPI.contractAddress}.rotate-member "${member}" (read-keyset 'ks))`
          ,{ks: JSON.parse(newKs)}
          ,"member" 
        );
      } catch (e) {
        console.log("rotate-member Submit Error",typeof e, e, member, newKs);
        setTxRes(e);
        setTxStatus("validation-error");
      }
      };
  const inputFields = [
    {
      type:'select',
      label:'Select your Member Account',
      className:classes.formControl,
      onChange:setMember,
      options:members.map((m)=>m['name']),
    },{
      type:'textFieldMulti',
      label:'New Keyset',
      className:classes.formControl,
      placeholder:JSON.stringify({"pred":"keys-all","keys":["8c59a322800b3650f9fc5b6742aa845bc1c35c2625dabfe5a9e9a4cada32c543"]},undefined,2),
      value:newKs,
      onChange:setNewKs,
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

export const ModeratorActionForms = (props) => {
  const {
    members,
    moderators,
    guardians,
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
            label:"Become Moderator",
            component:
              <BecomeModerator
                guardians={guardians}
                pactTxStatus={pactTxStatus}
                refresh={()=>getMembers()}/>
          },{
            label:"Rotate Moderator",
            component:
              <RotateModerator
                moderators={moderators}
                pactTxStatus={pactTxStatus}
                refresh={()=>getMembers()}/>
          },{
            label:"Enable Member",
            component:
              <EnableMember
                members={members}
                moderators={moderators}
                pactTxStatus={pactTxStatus}
                refresh={()=>getMembers()}/>
          },{
            label:"Disable Member",
            component:
              <DisableMember
                members={members}
                moderators={moderators}
                pactTxStatus={pactTxStatus}
                refresh={()=>getMembers()}/>
          }
      ]}/>
  );
}

export const MemberActionForms = (props) => {
  const {
    members,
    moderators,
    guardians,
    ambassadors,
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
            label:"Become Member",
            component:
              <BecomeMember
                ambassadors={ambassadors}
                pactTxStatus={pactTxStatus}
                refresh={()=>getMembers()}/>
          },{
            label:"Rotate Member",
            component:
              <RotateMember
                members={members}
                pactTxStatus={pactTxStatus}
                refresh={()=>getMembers()}/>
          }
      ]}/>
  );
}