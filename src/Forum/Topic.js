//basic React api imports
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from 'react-router-dom'
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
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
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
  dashStyleNames2Text,
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

export const RenderTopic = (props) => {
  const {topicId,topics} = props;
  const topic = _.find(topics,t=>t.index === topicId);
  return (
    _.has(topic, 'body') ?
    <Card>
      <CardHeader title={topic.headline}/>
      <CardContent>
        <Grid container direction="row" justify="space-between" alignItems="center" spacing={1}>
          <Grid item lg={8}>
            <PactSingleJsonAsTable
              keyFormatter={dashStyleNames2Text}
              json={[_.pick(topic,["author", "deleted", "locked", "modified", "timestamp"])]}
            />
          </Grid>
          <Grid item lg={2}>
            <TopicButtons topic={topic}/>
          </Grid>
          <Grid item lg={12}>
            <RenderMD mdText={topic.body} />
          </Grid>
        </Grid> 
      </CardContent>
    </Card>
    : <React.Fragment/>
  
)};

export const TopicButtons = (props) => {
  const history = useHistory();
  return (
    <ButtonGroup
    disableElevation
    orientation="horizontal"
    color="primary"
    variant="contained"
    lable="Member Actions"
  >
      <ButtonGroup
        disableElevation
        orientation="vertical"
        color="primary"
        variant="contained"
        label="Member Actions"
      >
        <IconButton size="small"
          onClick={()=> updateParams({ui:"topics",forumTab:"upVote"},history)}>
          <ThumbUpIcon/>
        </IconButton>
        <IconButton size="small"
          onClick={()=> updateParams({ui:"topics",forumTab:"removeVote"},history)}>
          <RemoveCircleOutlineIcon/>
        </IconButton>
        <IconButton size="small"
          onClick={()=> updateParams({ui:"topics",forumTab:"downVote"},history)}>
          <ThumbDownIcon/>
        </IconButton>
      </ButtonGroup>
      <ButtonGroup
        disableElevation
        orientation="vertical"
        color="default"
        variant="contained"
      >
        <IconButton size="small"
          onClick={()=> updateParams({ui:"moderators",modTab:"lock"},history)}>
          {/* TODO: make this icon change based on chain state */}
          <LockIcon/>
        </IconButton>
        <IconButton size="small"
          onClick={()=> updateParams({ui:"moderators",modTab:"delete"},history)}>
          <DeleteIcon/>
        </IconButton>
        <IconButton size="small"
          onClick={()=> updateParams({ui:"members",modTab:"edit",author:props.topic.author},history)}>
          <EditIcon/>
        </IconButton>
      </ButtonGroup>
    </ButtonGroup>
  );
}