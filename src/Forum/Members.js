//basic React api imports
import React, { useState, useEffect } from "react";
import { 
  useQueryParams,
  StringParam,
 } from 'use-query-params';
//make JS less terrible
import _ from "lodash";
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
import { usePactWallet, addGasCap } from "../PactWallet.js";

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
  signingKey,
  networkId,
  gasPrice,
  user,
  cmd, envData={}, role="member", caps=[]
) => {
    try {
      //creates transaction to send to wallet
      const toSign = {
          pactCode: cmd,
          caps: addGasCap(
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
          signingPubKey: signingKey,
          networkId: networkId,
          gasPrice: gasPrice,
          gasLimit: forumAPI.meta.gasLimit,
          chainId: forumAPI.meta.chainId,
          ttl: forumAPI.meta.ttl,
          sender: signingKey,
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

const BecomeModerator = (props) => {
  const {refresh, guardians} = props;
  const {current: {signingKey, networkId, gasPrice}} = usePactWallet();
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
          ,signingKey, networkId, Number.parseFloat(gasPrice)
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
  const {current: {signingKey, networkId, gasPrice}} = usePactWallet();
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
          ,signingKey, networkId, Number.parseFloat(gasPrice)
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
  const {current: {signingKey, networkId, gasPrice}} = usePactWallet();
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
          ,signingKey, networkId, Number.parseFloat(gasPrice)
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
  const {current: {signingKey, networkId, gasPrice}} = usePactWallet();
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
          ,signingKey, networkId, Number.parseFloat(gasPrice)
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
  const {current: {signingKey, networkId, gasPrice}} = usePactWallet();
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
          ,signingKey, networkId, Number.parseFloat(gasPrice)
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
  const {current: {signingKey, networkId, gasPrice}} = usePactWallet();
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
          ,signingKey, networkId, Number.parseFloat(gasPrice)
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

export const DeleteTopic = (props) => {
  const {refresh, moderators, topics} = props;
  const {current: {signingKey, networkId, gasPrice}} = usePactWallet();
  const [mod, setMod] = useState( "" );
  const [topicId, setTopicId] = useState( "" );
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const [appRoute,] = useQueryParams({
    "topicId": StringParam
  });

  const [routed,setRouted] = useState(false);
  useEffect(()=> {
    try {
      if (!routed && _.has(appRoute, ["topicId"])) {
        let topic = _.find(topics,t=>t.index === appRoute.topicId);
        setTopicId(topic.index);
        setRouted(true);
      }
    } catch (e) {}
  },[topics, appRoute, topicId,routed]);
  
  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMemberCmd(setTx,setTxStatus,setTxRes,refresh
          ,signingKey, networkId, Number.parseFloat(gasPrice)
          ,mod
          ,`(${forumAPI.contractAddress}.delete-topic "${mod}" "${topicId}")`
          ,{}
          ,"moderator" 
        );
      } catch (e) {
        console.log("delete-topic Submit Error",typeof e, e, mod, topicId);
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
      value:mod,
      options:moderators.map((m)=>m['name']),
    },{
      type:'select',
      label:'Select Topic Index',
      className:classes.formControl,
      onChange:setTopicId,
      value:topicId,
      options:topics.map((m)=>m['index']),
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


export const UnDeleteTopic = (props) => {
  const {refresh, moderators, topics} = props;
  const {current: {signingKey, networkId, gasPrice}} = usePactWallet();
  const [mod, setMod] = useState( "" );
  const [topicId, setTopicId] = useState( "" );
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const [appRoute,] = useQueryParams({
    "topicId": StringParam
  });

  const [routed,setRouted] = useState(false);
  useEffect(()=> {
    try {
      if (!routed && _.has(appRoute, ["topicId"])) {
        let topic = _.find(topics,t=>t.index === appRoute.topicId);
        setTopicId(topic.index);
        setRouted(true);
      }
    } catch (e) {}
  },[topics, appRoute, topicId,routed]);
  
  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMemberCmd(setTx,setTxStatus,setTxRes,refresh
          ,signingKey, networkId, Number.parseFloat(gasPrice)
          ,mod
          ,`(${forumAPI.contractAddress}.undelete-topic "${mod}" "${topicId}")`
          ,{}
          ,"moderator" 
        );
      } catch (e) {
        console.log("undelete-topic Submit Error",typeof e, e, mod, topicId);
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
      value:mod,
      options:moderators.map((m)=>m['name']),
    },{
      type:'select',
      label:'Select Topic Index',
      className:classes.formControl,
      onChange:setTopicId,
      value:topicId,
      options:topics.map((m)=>m['index']),
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

export const LockTopic = (props) => {
  const {refresh, moderators, topics} = props;
  const {current: {signingKey, networkId, gasPrice}} = usePactWallet();
  const [mod, setMod] = useState( "" );
  const [topicId, setTopicId] = useState( "" );
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const [appRoute,] = useQueryParams({
    "topicId": StringParam
  });

  const [routed,setRouted] = useState(false);
  useEffect(()=> {
    try {
      if (!routed && _.has(appRoute, ["topicId"])) {
        let topic = _.find(topics,t=>t.index === appRoute.topicId);
        setTopicId(topic.index);
        setRouted(true);
      }
    } catch (e) {}
  },[topics, appRoute, topicId, routed])
  
  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMemberCmd(setTx,setTxStatus,setTxRes,refresh
          ,signingKey, networkId, Number.parseFloat(gasPrice)
          ,mod
          ,`(${forumAPI.contractAddress}.lock-topic "${mod}" "${topicId}")`
          ,{}
          ,"moderator" 
        );
      } catch (e) {
        console.log("lock-topic Submit Error",typeof e, e, mod, topicId);
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
      value:mod,
      options:moderators.map((m)=>m['name']),
    },{
      type:'select',
      label:'Select Topic Index',
      className:classes.formControl,
      onChange:setTopicId,
      value:topicId,
      options:topics.map((m)=>m['index']),
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

export const UnlockTopic = (props) => {
  const {refresh, moderators, topics} = props;
  const {current: {signingKey, networkId, gasPrice}} = usePactWallet();
  const [mod, setMod] = useState( "" );
  const [topicId, setTopicId] = useState( "" );
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const [appRoute,] = useQueryParams({
    "topicId": StringParam
  });

  const [routed,setRouted] = useState(false);
  useEffect(()=> {
    try {
      if (!routed && _.has(appRoute, ["topicId"])) {
        let topic = _.find(topics,t=>t.index === appRoute.topicId);
        setTopicId(topic.index);
        setRouted(true);
      }
    } catch (e) {}
  },[topics, appRoute, topicId, routed]);
  
  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMemberCmd(setTx,setTxStatus,setTxRes,refresh
          ,signingKey, networkId, Number.parseFloat(gasPrice)
          ,mod
          ,`(${forumAPI.contractAddress}.unlock-topic "${mod}" "${topicId}")`
          ,{}
          ,"moderator" 
        );
      } catch (e) {
        console.log("unlock-topic Submit Error",typeof e, e, mod, topicId);
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
      value:mod,
      options:moderators.map((m)=>m['name']),
    },{
      type:'select',
      label:'Select Topic Index',
      className:classes.formControl,
      onChange:setTopicId,
      value:topicId,
      options:topics.map((m)=>m['index']),
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

export const DeleteTopicComment = ({
  moderators,
  comments,
  refresh,
  pactTxStatus: {
    txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} 
}) => {
  const {current: {signingKey, networkId, gasPrice}} = usePactWallet();
  const [mod, setMod] = useState( "" );
  const [commentId, setCommentId] = useState( "" );
  const classes = useStyles();

  const [appRoute,] = useQueryParams({
    "commentId": StringParam
  });

  const [routed,setRouted] = useState(false);
  useEffect(()=> {
    try {
      if (!routed && _.has(appRoute, ["commentId"])) {
        let comment = _.find(comments,t=>t.index === appRoute.commentId);
        setCommentId(comment.index);
        setRouted(true);
      }
    } catch (e) {}
  },[comments, appRoute, commentId, routed]);
  
  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMemberCmd(setTx,setTxStatus,setTxRes,refresh
          ,signingKey, networkId, Number.parseFloat(gasPrice)
          ,mod
          ,`(${forumAPI.contractAddress}.delete-topic-comment "${mod}" "${commentId}")`
          ,{}
          ,"moderator" 
        );
      } catch (e) {
        console.log("delete-topic-comment Submit Error",typeof e, e, mod, commentId);
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
      value:mod,
      options:moderators.map((m)=>m['name']),
    },{
      type:'select',
      label:'Select Comment Index',
      className:classes.formControl,
      onChange:setCommentId,
      value:commentId,
      options:comments.map((m)=>m['index']),
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


export const VoteOnTopic = ({
  members,
  moderators,
  topics,
  refresh,
  pactTxStatus: {
    txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} 
}) => {
  const {current: {signingKey, networkId, gasPrice}} = usePactWallet();
  const [member,setMember] = useState("");
  const [vote, setVote] = useState( "" );
  const [topicId, setTopicId] = useState( "" );
  const classes = useStyles();

  const [appRoute,] = useQueryParams({
    "topicId":StringParam,
    "vote":StringParam
  });

  const [routed,setRouted] = useState(false);
  useEffect(()=> {
    try {
      if (!routed && _.has(appRoute, ["topicId"])) {
        let topic = _.find(topics,t=>t.index === appRoute.topicId);
        setTopicId(topic.index);
        setVote(appRoute.vote || "");
        setRouted(true);
      }
    } catch (e) {}
  },[topics, appRoute, topicId, routed, vote]);
  
  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMemberCmd(setTx,setTxStatus,setTxRes,refresh
          ,signingKey, networkId, Number.parseFloat(gasPrice)
          ,member
          ,`(${forumAPI.contractAddress}.vote-on-topic "${member}" "${topicId}" "${vote}")`
          ,{}
        );
      } catch (e) {
        console.log("vote-on-topic Submit Error",typeof e, e, member, topicId, vote);
        setTxRes(e);
        setTxStatus("validation-error");
      }
      };
  const inputFields = [
    {
      type:'select',
      label:'Member Account',
      className:classes.formControl,
      onChange:setMember,
      value:member,
      options:moderators.map(g=>g.name).concat(members.map(m=>m.name)),
    },{
      type:'select',
      label:'Select Topic Index',
      className:classes.formControl,
      onChange:setTopicId,
      value:topicId,
      options:topics.map((m)=>m['index']),
    },{
      type:'select',
      label:'Select Vote',
      className:classes.formControl,
      onChange:setVote,
      value:vote,
      options:["upvote","remove","downvote"],
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

export const VoteOnComment = ({
  moderators,
  members,
  comments,
  refresh,
  pactTxStatus: {
    txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} 
}) => {
  const {current: {signingKey, networkId, gasPrice}} = usePactWallet();
  const [member,setMember] = useState("");
  const [vote, setVote] = useState( "" );
  const [commentId, setCommentId] = useState( "" );
  const classes = useStyles();

  const [appRoute,] = useQueryParams({
    "commentId":StringParam,
    "vote":StringParam
  });

  const [routed,setRouted] = useState(false);
  useEffect(()=> {
    try {
      if (!routed && _.has(appRoute, ["commentId"])) {
        let comment = _.find(comments,t=>t.index === appRoute.commentId);
        setCommentId(comment.index);
        setVote(appRoute.vote);
        setRouted(true);
      }
    } catch (e) {}
  },[comments, appRoute, commentId, vote, routed]);
  
  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMemberCmd(setTx,setTxStatus,setTxRes,refresh
          ,signingKey, networkId, Number.parseFloat(gasPrice)
          ,member
          ,`(${forumAPI.contractAddress}.vote-on-comment "${member}" "${commentId}" "${vote}")`
          ,{}
        );
      } catch (e) {
        console.log("vote-on-comment Submit Error",typeof e, e, member, commentId, vote);
        setTxRes(e);
        setTxStatus("validation-error");
      }
      };
  const inputFields = [
    {
      type:'select',
      label:'Member Account',
      className:classes.formControl,
      onChange:setMember,
      value:member,
      options:moderators.map(g=>g.name).concat(members.map(m=>m.name)),
    },{
      type:'select',
      label:'Select Comment Index',
      className:classes.formControl,
      onChange:setCommentId,
      value:commentId,
      options:comments.map((m)=>m['index']),
    },{
      type:'select',
      label:'Select Vote',
      className:classes.formControl,
      onChange:setVote,
      value:vote,
      options:["upvote","remove","downvote"],
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

export const DeleteCommentComment = ({
  moderators,
  comments,
  refresh,
  pactTxStatus: {
    txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} 
}) => {
  const {current: {signingKey, networkId, gasPrice}} = usePactWallet();
  const [mod, setMod] = useState( "" );
  const [commentId, setCommentId] = useState( "" );
  const classes = useStyles();

  const [appRoute,] = useQueryParams({
    "commentId": StringParam
  });

  const [routed,setRouted] = useState(false);
  useEffect(()=> {
    try {
      if (!routed && _.has(appRoute, ["commentId"])) {
        let comment = _.find(comments,t=>t.index === appRoute.commentId);
        setCommentId(comment.index);
        setRouted(true);
      }
    } catch (e) {}
  },[comments, appRoute, commentId, routed]);
  
  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMemberCmd(setTx,setTxStatus,setTxRes,refresh
          ,signingKey, networkId, Number.parseFloat(gasPrice)
          ,mod
          ,`(${forumAPI.contractAddress}.delete-comment-comment "${mod}" "${commentId}")`
          ,{}
          ,"moderator" 
        );
      } catch (e) {
        console.log("delete-comment-comment Submit Error",typeof e, e, mod, commentId);
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
      value:mod,
      options:moderators.map((m)=>m['name']),
    },{
      type:'select',
      label:'Select Comment Index',
      className:classes.formControl,
      onChange:setCommentId,
      value:commentId,
      options:comments.map((m)=>m['index']),
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

export const ModeratorActionForms = ({
  members,
  moderators,
  guardians,
  topics,
  comments,
  tabIdx,
  pactTxStatus,
  refresh: {
    getForumState,
    getMembers,
    getTopics,
    getComments,
  },
}) => {
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
          },{
            label:"Delete Topic",
            component:
              <DeleteTopic
                moderators={moderators}
                topics={topics}
                pactTxStatus={pactTxStatus}
                refresh={()=>getTopics()}/>
          },{
            label:"UnDelete Topic",
            component:
              <UnDeleteTopic
                moderators={moderators}
                topics={topics}
                pactTxStatus={pactTxStatus}
                refresh={()=>getTopics()}/>
          },{
            label:"Lock Topic",
            component:
              <LockTopic
                moderators={moderators}
                topics={topics}
                pactTxStatus={pactTxStatus}
                refresh={()=>getTopics()}/>
          },{
            label:"Unlock Topic",
            component:
              <LockTopic
                moderators={moderators}
                topics={topics}
                pactTxStatus={pactTxStatus}
                refresh={()=>getTopics()}/>
          },{
            label:"Delete Topic Comment",
            component:
              <DeleteTopicComment
                moderators={moderators}
                comments={comments}
                pactTxStatus={pactTxStatus}
                refresh={()=>{getComments(); getTopics(); return null;}}/>
          },{
            label:"Delete Comment Reply",
            component:
              <DeleteCommentComment
                moderators={moderators}
                comments={comments}
                pactTxStatus={pactTxStatus}
                refresh={()=>{getComments(); getTopics(); return null;}}/>
          }
      ]}/>
  );
};

export const ModeratorTopicForms = ({
  moderators,
  topics,
  tabIdx,
  pactTxStatus,
  refresh: {
    getTopics,
    getComments,
  },
}) => {
  return (
    <ScrollableTabs
      tabIdx={tabIdx}
      tabEntries={[
          {
            label:"Delete Topic",
            component:
              <DeleteTopic
                moderators={moderators}
                topics={topics}
                pactTxStatus={pactTxStatus}
                refresh={()=>getTopics()}/>
          },{
            label:"UnDelete Topic",
            component:
              <UnDeleteTopic
                moderators={moderators}
                topics={topics}
                pactTxStatus={pactTxStatus}
                refresh={()=>getTopics()}/>
          },{
            label:"Lock Topic",
            component:
              <LockTopic
                moderators={moderators}
                topics={topics}
                pactTxStatus={pactTxStatus}
                refresh={()=>getTopics()}/>
          },{
            label:"Unlock Topic",
            component:
              <LockTopic
                moderators={moderators}
                topics={topics}
                pactTxStatus={pactTxStatus}
                refresh={()=>getTopics()}/>
          }
      ]}/>
  );
};

export const MemberActionForms = ({
  members,
  moderators,
  guardians,
  ambassadors,
  topics,
  comments,
  tabIdx,
  pactTxStatus,
  refresh: {
    getForumState,
    getMembers,
    getTopics,
    getComments,
    }
}) => {

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
          },{
            label:"Vote on Comment",
            component:
              <VoteOnComment
                members={members}
                moderators={moderators}
                comments={comments}
                pactTxStatus={pactTxStatus}
                refresh={()=>getComments()}/>
          }
      ]}/>
  );
}