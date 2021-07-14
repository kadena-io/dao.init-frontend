import React, { useState } from "react";
import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";
import gfm from 'remark-gfm';
import "react-mde/lib/styles/css/react-mde-all.css";

import {
  Container, makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
      '& p img': {width: "100%"},
  }
}));

export const MDEditor = (props) => {
  const {value, onChange} = props;
  const [selectedTab, setSelectedTab] = useState("write");
  const classes = useStyles();

  const saveImage = async function (data) {
    // Promise that waits for "time" milliseconds
    alert("No attachments!");
    // returns true meaning that the save was successful
    return "No Attachments";
  };

  return (
      <ReactMde
        value={value}
        onChange={onChange}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) => {
          const res = Promise.resolve(<ReactMarkdown remarkPlugins={[gfm]} children={markdown} className={classes.root}/>);
          console.log(`react-mde-preview=${res}`, res);
          return res;
        }}
        childProps={{
          writeButton: {
            tabIndex: -1
          }
        }}
        paste={{
          saveImage: saveImage
        }}
      />
  );
}

export const RenderMD = (props) => {
  const classes = useStyles();
  return  <Container>
            <ReactMarkdown remarkPlugins={[gfm]} children={props.mdText} className={classes.root}/>
          </Container>
}
