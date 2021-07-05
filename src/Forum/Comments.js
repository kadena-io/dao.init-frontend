//basic React api imports
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from 'react-router-dom';
import { 
  useQueryParams,
  StringParam,
  withDefault,
  NumberParam
 } from 'use-query-params';
//make JS less terrible
import _ from "lodash";
//Material Stuff
import {
  Button,
  ButtonGroup,
  CardActions,
  Card,
  CardHeader,
  CardContent,
  Checkbox,
  ClickAwayListener,
  Grid,
  Grow,
  LinearProgress,
  IconButton,
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
  Typography,
} from '@material-ui/core';
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
  updateParams,
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

export const RenderComments = ({comments}) => {
  return (
    <PactJsonListAsTable
      header={["","Body","Author","Timestamp","Modified","Locked"]}
      keyOrder={["index","body","author","timestamp","modified","locked"]}
      json={comments}
    />
)};

export const CommentOnTopic = ({
  members,
  moderators,
  topics,
  refresh,
  pactTxStatus: {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes}
  }) => {
  const [author, setAuthor] = useState( "" );
  const [topicId, setTopicId] = useState( "" );
  const [body, setBody] = useState("");
  const classes = useStyles();
  const [appRoute,] = useQueryParams({
    "topicId": StringParam
  });

  useEffect(()=> {
    let topic = _.find(topics,t=>t.index === appRoute.topicId);
    if (_.size(topic)) {
      // console.log("modifyTopic",appRoute.topicId,topic,topics);
      setTopicId(topic.index);
    } else {
      // console.log("modifyTopic index not found",appRoute.topicId, topics);
      setTopicId("");
    }
  },[topics, appRoute, topicId]);

  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMemberCmd(setTx,setTxStatus,setTxRes,refresh
          ,author
          ,`(${forumAPI.contractAddress}.post-topic-comment "${author}" (read-msg 'body) "${topicId}")`
          ,{body: body}
          );
      } catch (e) {
        console.log("post-topic-comment Submit Error",typeof e, e, author, body, topicId);
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
      value:author,
      options:moderators.map(g=>g.name).concat(members.map(m=>m.name)),
    },{
      type:'select',
      label:'Topic Index',
      className:classes.formControl,
      onChange:setTopicId,
      value:topicId,
      options:topics.map(v=>v["index"]),
    },{
      type:'markdown',
      label:"Comment Contents",
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


export const ReplyToComment = ({
  members,
  moderators,
  comments,
  refresh,
  pactTxStatus: {txStatus, setTxStatus,
    tx, setTx,
    txRes, setTxRes}
  }) => {
  const [author, setAuthor] = useState( "" );
  const [commentId, setCommentId] = useState( "" );
  const [body, setBody] = useState("");
  const [manualOverride,setManualOverride] = useState(false);
  const classes = useStyles();
  const [appRoute,] = useQueryParams({
    "commentId": StringParam
  });

  useEffect(()=> {
    let comment = _.find(comments,t=>t.index === appRoute.topicId);
    if (!manualOverride) {
      if (_.size(comment)) {
        // console.log("modifyTopic",appRoute.topicId,topic,topics);
        setCommentId(comment.index);
      } else {
        // console.log("modifyTopic index not found",appRoute.topicId, topics);
        setCommentId("");
      }
    }
  },[comments, appRoute, commentId, manualOverride]);

  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMemberCmd(setTx,setTxStatus,setTxRes,refresh
          ,author
          ,`(${forumAPI.contractAddress}.post-comment-comment "${author}" (read-msg 'body) "${commentId}")`
          ,{body: body}
          );
      } catch (e) {
        console.log("post-comment-comment Submit Error",typeof e, e, author, body, commentId);
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
      value:author,
      options:moderators.map(g=>g.name).concat(members.map(m=>m.name)),
    },{
      type:'select',
      label:'Comment Index',
      className:classes.formControl,
      onChange:(v) => {setManualOverride(true); return setCommentId(v)},
      value:commentId,
      options:comments.map(v=>v["index"]),
    },{
      type:'markdown',
      label:"Comment Contents",
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


export const CommentsActionForms = (props) => {
  const {
    members,
    moderators,
    topics,
    comments,
    tabIdx,
    pactTxStatus,
  } = props;
  const {
    getTopics,
    getComments,
  } = props.refresh;

  return (
    <ScrollableTabs
      tabIdx={tabIdx}
      tabEntries={[
          {
            label:"Comment on Topic",
            component:
              <CommentOnTopic
                members={members}
                moderators={moderators}
                topics={topics}
                pactTxStatus={pactTxStatus}
                refresh={() => {getTopics(); getComments(); return null}}/>
          },{
            label:"Reply to Comment",
            component:
              <ReplyToComment
                members={members}
                moderators={moderators}
                comments={comments}
                pactTxStatus={pactTxStatus}
                refresh={() => getComments()}/>
          }
      ]}/>
  );
}
