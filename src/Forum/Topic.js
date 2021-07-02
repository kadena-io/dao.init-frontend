//basic React api imports
import React from "react";
import { 
  useQueryParams,
  StringParam } from 'use-query-params';
//make JS less terrible
import _ from "lodash";
//Material Stuff
import {
  ButtonGroup,
  Card,
  CardHeader,
  CardContent,
  Grid,
  IconButton,
} from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import LockIcon from '@material-ui/icons/Lock';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {
  makeStyles,
} from '@material-ui/styles';
//pact-lang-api for blockchain calls
//config file for blockchain calls
import {
  PactSingleJsonAsTable,
  dashStyleNames2Text,
 } from "../util.js";
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
  const {topics} = props;
  const [appRoute,setAppRoute] = useQueryParams({
    "topicId": StringParam
  });
  const topic = _.find(topics,t=>t.index === appRoute.topicId);
  console.log("renderTopic",appRoute.topicId,topic,topics);
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
   const [appRoute,setAppRoute] = useQueryParams({
    "ui": StringParam,
    "forumTab":StringParam,
    "modTab":StringParam,
    "author":StringParam,
  });
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
          onClick={()=> setAppRoute({ui:"topics",forumTab:"upVote"})}>
          <ThumbUpIcon/>
        </IconButton>
        <IconButton size="small"
          onClick={()=> setAppRoute({ui:"topics",forumTab:"removeVote"})}>
          <RemoveCircleOutlineIcon/>
        </IconButton>
        <IconButton size="small"
          onClick={()=> setAppRoute({ui:"topics",forumTab:"downVote"})}>
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
          onClick={()=> setAppRoute({ui:"moderators",modTab:"lock"})}>
          {/* TODO: make this icon change based on chain state */}
          <LockIcon/>
        </IconButton>
        <IconButton size="small"
          onClick={()=> setAppRoute({ui:"moderators",modTab:"delete"})}>
          <DeleteIcon/>
        </IconButton>
        <IconButton size="small"
          onClick={()=> setAppRoute({ui:"members",modTab:"edit",author:props.topic.author})}>
          <EditIcon/>
        </IconButton>
      </ButtonGroup>
    </ButtonGroup>
  );
}