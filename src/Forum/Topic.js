//basic React api imports
import React, {useState} from "react";
import { 
  useQueryParams,
  StringParam } from 'use-query-params';
//make JS less terrible
import _ from "lodash";
//Material Stuff
import {
  Box,
  ButtonGroup,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
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
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {
  makeStyles,
} from '@material-ui/styles';
//pact-lang-api for blockchain calls
//config file for blockchain calls
import {
  PactSingleJsonAsTable,
  dashStyleNames2Text,
  renderPactValue,
 } from "../util.js";
import { RenderMD } from "../Markdown.js";
import { CommentsActionForms } from "./Comments.js";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "5px auto",
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: "10px auto",
  },
  nested: {
    paddingLeft: theme.spacing(8),
  }
}));

const nestedConst = 0.25;

export const RenderTopic = ({
  topics,
  comments,
  members,
  moderators,
  pactTxStatus,
  refresh,
}) => {
  const [appRoute,setAppRoute] = useQueryParams({
  "ui": StringParam,
  "forumTab":StringParam,
  "modTab":StringParam,
  "memTab":StringParam,
  "topicsTab":StringParam,
  "author":StringParam,
  "topicId":StringParam,
  "commentId":StringParam,
});
  const topic = _.find(topics,t=>t.index === appRoute.topicId);
  // console.log("renderTopic",appRoute.topicId,topic,topics);
  return (
    _.has(topic, 'body') ?
    <Card>
      <CardHeader title={
        <Box textOverflow="ellipsis" overflow="hidden">
          {topic.headline}
        </Box>}/>
      <CardContent>
      <List>
        <ListItem>
        <Box textOverflow="ellipsis" overflow="hidden">
            <RenderMD mdText={topic.body} />
        </Box>
        </ListItem>
        <ListItem>
            <TopicButtons topic={topic}/>
        </ListItem>
        <ListItem>
            <PactSingleJsonAsTable
              keyFormatter={dashStyleNames2Text}
              json={[_.pick(topic,["author", "deleted", "locked", "modified", "timestamp"])]}
            />
        </ListItem>
        </List>

        <Divider/>
        <RenderComments 
          topicId={topic['index']} 
          topics={topics} 
          comments={comments}
          members={members}
          moderators={moderators}
          pactTxStatus={pactTxStatus}
          refresh={refresh}
          setAppRoute={setAppRoute}
          />
      </CardContent>
    </Card>
    : <React.Fragment/>
  
)};

const RenderComments = ({
  topicId,
  topics,
  comments,
  members,
  moderators,
  pactTxStatus,
  refresh,
  setAppRoute,
}) => {
  const topic = _.find(topics, {'index':topicId});
  const topicComments = topic['comment-indexs']
  // TODO: display comments in order of upvotes
  
  return <React.Fragment>
    <List component="div" disablePadding>
    {topicComments.map((commentId)=> 
      <RenderComment 
        topicId={topicId}
        commentId={commentId}
        comments={comments}
        isNested={0}
        members={members}
        moderators={moderators}
        topics={topics}
        pactTxStatus={pactTxStatus}
        refresh={refresh}
        setAppRoute={setAppRoute}
        />
    )}
    </List>
  </React.Fragment>
};

const RenderComment = ({
  topicId, 
  commentId,
  comments,
  isNested,
  members,
  moderators,
  topics,
  pactTxStatus,
  refresh,
  setAppRoute,
}) => {
  const comment = _.find(comments, {'index':commentId});
  // console.log(commentId,comments, comment);
  const [showInteract,setShowInteract] = useState(false);
  const classes = {"paddingLeft": `${isNested * nestedConst}em`};

  const secondaryText = isNested ? (
    `Reply by ${comment.author} on ${renderPactValue(comment.timestamp)}${comment.modified ? " [edited]" : ""}`
  ) : (
    `Comment by ${comment.author} on ${renderPactValue(comment.timestamp)}${comment.modified ? " [edited]" : ""}`
  );

  const handleInteractClick = () => {
    setAppRoute({commentId:comment.index});
    setShowInteract(!showInteract);
  };
  
  return <React.Fragment>
    <ListItem key={comment.index} style={isNested ? classes : null}>
      <RenderMD mdText={`*${secondaryText}* \n\n` + comment.body} />
      { showInteract ? 
          <ExpandLess onClick={handleInteractClick}/> 
          : <ExpandMore onClick={handleInteractClick}/> }
    </ListItem>
    <Collapse in={showInteract} timeout="auto" unmountOnExit style={isNested ? {"marginLeft": `${isNested * nestedConst}em`}:null}>
      <CommentsActionForms
        tabIdx="inTopicTab"
        members={members}
        moderators={moderators}
        topics={topics}
        comments={comments}
        pactTxStatus={pactTxStatus}
        refresh={refresh}
      />
    </Collapse>
    <div style={isNested ? classes : null}>
    <Divider component="li"/>
      <List component="div" disablePadding>
        {comment['child-indexs'].map((childId) => 
          <RenderComment 
            topicId={topicId}
            commentId={childId}
            comments={comments}
            isNested={isNested + 1}
            members={members}
            moderators={moderators}
            topics={topics}
            pactTxStatus={pactTxStatus}
            refresh={refresh}
            setAppRoute={setAppRoute}
            />
        )}
      </List>
    </div>
  </React.Fragment>
}

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
      <Tooltip title={topic.deleted ? "Restore Deleted Topic" : "Delete Topic"}>
        <IconButton size="small"
          onClick={()=> setAppRoute({ui:"moderators",modTab:topic.delete ? "5" : "4"})}>
          {topic.delete ? <RestoreFromTrashIcon/> : <DeleteIcon/>}
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit Topic">
        <IconButton size="small"
          onClick={()=> setAppRoute({ui:"topics",topicsTab:"1"})}>
          <EditIcon/>
        </IconButton>
        </Tooltip>
      <Tooltip title="Comment on Topic">
        <IconButton size="small"
          onClick={()=> setAppRoute({ui:"topics",commentsTab:"3"})}>
          <CommentIcon/>
        </IconButton>
        </Tooltip>
      </ButtonGroup>
  );
}