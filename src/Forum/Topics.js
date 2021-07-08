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
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
//pact-lang-api for blockchain calls
import Pact from "pact-lang-api";
//config file for blockchain calls
import { daoAPI, forumAPI } from "../kadena-config.js";
import {
  PactJsonListAsTable,
  PactSingleJsonAsTable,
  MakeForm,
  updateParams,
  renderPactValue,
 } from "../util.js";
import { 
  sendMemberCmd, 
  VoteOnTopic, } from "./Members.js";
import { ScrollableTabs } from "../ScrollableTabs.js";
import { CommentOnTopic } from "./Comments.js";
import { ModeratorTopicForms } from "./Members.js";

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

export const RenderTopics = ({
  topics,
  moderators,
  pactTxStatus,
  refresh,
}) => {
  
  const [,setAppRoute] = useQueryParams({
  "ui": StringParam,
  "topicsTab":StringParam,
  "topicId":StringParam,
});
  return <React.Fragment>
    <List component="div" disablePadding>
    {topics.map((topic)=> 
      <RenderTopic
        moderators={moderators}
        topic={topic}
        topics={topics}
        pactTxStatus={pactTxStatus}
        refresh={refresh}
        setAppRoute={setAppRoute}
        />
    )}
    </List>
  </React.Fragment>
};

const RenderTopic = ({
  moderators,
  topic,
  topics,
  pactTxStatus,
  refresh,
  setAppRoute,
}) => {
  // console.log(commentId,comments, comment);
  const [showInteract,setShowInteract] = useState(false);
  const classes = useStyles();
  
  const secondaryText = `Comment by ${topic.author} on ${renderPactValue(topic.timestamp)}${topic.modified ? " [edited]" : ""}`

  const handleInteractClick = () => {
    setAppRoute({topicId:topic.index});
    setShowInteract(!showInteract);
  };
  
  return <React.Fragment>
    <ListItem button
      onClick={()=> setAppRoute({app:"forum",ui:"topic",topicId:topic.index})}>
      <ListItemText
        primary={
        <Box textOverflow="ellipsis" overflow="hidden">
          {topic.headline}
        </Box>}
        secondary={
        <Box textOverflow="ellipsis" overflow="hidden">
          {secondaryText}
        </Box>}
        />
      { showInteract ? 
          <ExpandLess onClick={handleInteractClick}/> 
          : <ExpandMore onClick={handleInteractClick}/> }
    </ListItem>
    <Collapse in={showInteract} timeout="auto" unmountOnExit>
      <ModeratorTopicForms
        tabIdx="topicsTab"
        moderators={moderators}
        topics={topics}
        pactTxStatus={pactTxStatus}
        refresh={refresh}
      />
    </Collapse>
    <Divider component="li"/>
  </React.Fragment>
}


export const PostTopic = (props) => {
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
      value:author,
      options:moderators.map(g=>g.name).concat(members.map(m=>m.name)),
    },{
      type:'textFieldSingle',
      label:'Headline',
      className:classes.formControl,
      value:headline,
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

export const ModifyTopic = (props) => {
  const {refresh, topics} = props;
  const [author,setAuthor] = useState("");
  const [topicId,setTopicId] = useState("");
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
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
        setAuthor(topic.author);
        setBody(topic.body);
        setHeadline(topic.headline)
        setRouted(true);
      }
    } catch (e) {}
  },[topics, appRoute, topicId, routed]);

  const handleSubmit = (evt) => {
      evt.preventDefault();
      try {
        sendMemberCmd(setTx,setTxStatus,setTxRes,refresh
          ,author
          ,`(${forumAPI.contractAddress}.modify-topic "${topicId}" (read-msg 'headline) (read-msg 'body))`
          ,{headline: headline, body: body}
          );
      } catch (e) {
        console.log("modify-topic Submit Error",typeof e, e, author, headline, body);
        setTxRes(e);
        setTxStatus("validation-error");
      }
      };
  const inputFields = [
    {
      type:'textFieldSingle',
      label:'Headline',
      className:classes.formControl,
      value:headline,
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

export const TopicsActionForms = (props) => {
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
            label:"Post Topic",
            component:
              <PostTopic
                members={members}
                moderators={moderators}
                pactTxStatus={pactTxStatus}
                refresh={()=> getTopics()}/>
          },{
            label:"Edit Topic",
            component:
              <ModifyTopic
                topics={topics}
                pactTxStatus={pactTxStatus}
                refresh={() => getTopics()}/>
          },{
            label:"Vote on Topic",
            component:
              <VoteOnTopic
                members={members}
                moderators={moderators}
                topics={topics}
                pactTxStatus={pactTxStatus}
                refresh={()=>getTopics()}/>
          },{
            label:"Comment on Topic",
            component:
              <CommentOnTopic
                members={members}
                moderators={moderators}
                topics={topics}
                pactTxStatus={pactTxStatus}
                refresh={() => {getTopics(); getComments(); return null}}/>
          }
      ]}/>
  );
}
