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
  Tooltip,
} from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import DeleteIcon from '@material-ui/icons/Delete';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import EditIcon from '@material-ui/icons/Edit';
import CommentIcon from '@material-ui/icons/Comment';
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
  const [appRoute,] = useQueryParams({
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

export const TopicButtons = ({topic}) => {
   const [,setAppRoute] = useQueryParams({
    "ui": StringParam,
    "forumTab":StringParam,
    "modTab":StringParam,
    "memTab":StringParam,
    "topicsTab":StringParam,
    "author":StringParam,
    "topicId":StringParam,
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
        <Tooltip title="Vote For Topic">
        <IconButton size="small"
          onClick={()=> setAppRoute({ui:"topics",forumTab:"0"})}>
          <ThumbUpIcon/>
        </IconButton>
        </Tooltip>
        <Tooltip title="Remove Your Vote">
        <IconButton size="small"
          onClick={()=> setAppRoute({ui:"topics",forumTab:"1"})}>
          <RemoveCircleOutlineIcon/>
        </IconButton>
        </Tooltip>
        <Tooltip title="Vote Against Topic">
        <IconButton size="small"
          onClick={()=> setAppRoute({ui:"topics",forumTab:"2"})}>
          <ThumbDownIcon/>
        </IconButton>
        </Tooltip>
      </ButtonGroup>
      <ButtonGroup
        disableElevation
        orientation="vertical"
        color="default"
        variant="contained"
      >
      <React.Fragment>
        {topic.locked ? 
        <Tooltip title="Unlock Topic">
        <IconButton size="small"
          onClick={()=> setAppRoute({ui:"moderators",modTab:"7"})}>
          <LockOpenIcon/>
        </IconButton>
        </Tooltip>
        : 
        <Tooltip title="Lock Topic">
        <IconButton size="small"
          onClick={()=> setAppRoute({ui:"moderators",modTab:"6"})}>
          <LockIcon/>
        </IconButton>
        </Tooltip>
        }
      </React.Fragment>
      <React.Fragment>
        {topic.deleted ? 
        <Tooltip title="Restore Deleted Topic">
        <IconButton size="small"
          onClick={()=> setAppRoute({ui:"moderators",modTab:"5"})}>
          <RestoreFromTrashIcon/>
        </IconButton>
        </Tooltip>
        : 
        <Tooltip title="Delete Topic">
        <IconButton size="small"
          onClick={()=> setAppRoute({ui:"moderators",modTab:"4"})}>
          <DeleteIcon/>
        </IconButton>
        </Tooltip>
        }
      </React.Fragment>
      <Tooltip title="Edit Topic">
        <IconButton size="small"
          onClick={()=> setAppRoute({ui:"topics",topicsTab:"1"})}>
          <EditIcon/>
        </IconButton>
        </Tooltip>
      <Tooltip title="Comment on Topic">
        <IconButton size="small"
          onClick={()=> setAppRoute({ui:"comments",commentsTab:"0"})}>
          <CommentIcon/>
        </IconButton>
        </Tooltip>
      </ButtonGroup>
    </ButtonGroup>
  );
}