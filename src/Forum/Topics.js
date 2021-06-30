//basic React api imports
import React, { useState } from "react";
//make JS less terrible
import _ from "lowdash";
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
  PactSingleJsonAsTable,
  MakeForm,
 } from "../util.js";
import { sendMemberCmd } from "./Members.js";
import { ScrollableTabs } from "../ScrollableTabs.js";
import { RenderMD } from "../Markdown.js";

const useStyles = makeStyles(() => ({
  formControl: {
    margin: "5px auto",
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: "10px auto",
  },
}));

export const RenderTopics = (props) => {
  return (
    <PactJsonListAsTable
      header={["Index","Author","Headline","Timestamp","Modified","Locked"]}
      keyOrder={["index","author","headline","timestamp","modified","locked"]}
      json={props.topics}
    />
)};

export const RenderTopic = (props) => {
  const {topicID,topics} = props;
  return <RenderMD mdText="**Hellow world**\n- foo" />
}

const PostTopic = (props) => {
  const {refresh, members, moderators} = props;
  const [author, setAuthor] = useState( "" );
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes} = props.pactTxStatus;
  const classes = useStyles();

  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMemberCmd(setTx,setTxStatus,setTxRes,refresh
          ,author
          ,`(${forumAPI.contractAddress}.post-topic (read-msg 'headline) "${author}" (read-msg 'body))`
          ,{headline: headline, body: body}
          );
      } catch (e) {
        console.log("post-topic Submit Error",typeof e, e, author, headline, body);
        setTxRes(e);
        setTxStatus("validation-error");
      }
      };
  const inputFields = [
    {
      type:'select',
      label:'Author',
      className:classes.formControl,
      onChange:setAuthor,
      options:moderators.map(g=>g.name).concat(members.map(m=>m.name)),
    },{
      type:'textFieldSingle',
      label:'Headline',
      className:classes.formControl,
      onChange:setHeadline,
    },{
      type:'markdown',
      label:"Contents",
      value:body,
      onChange:setBody,
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

export const TopicActionForms = (props) => {
  const {
    members,
    moderators,
    topics,
    tabIdx,
    pactTxStatus,
  } = props;
  const {
    getTopics,
  } = props.refresh;

  return (
    <ScrollableTabs
      tabIdx={tabIdx}
      tabEntries={[
          {
            label:"Post Topic",
            component:
              <PostTopic
                members={members}
                moderators={moderators}
                pactTxStatus={pactTxStatus}
                refresh={()=>getTopics()}/>
          }
      ]}/>
  );
}
