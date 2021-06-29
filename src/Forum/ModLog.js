//basic React api imports
import React from "react";

//config file for blockchain calls
import {
  PactJsonListAsTable,
 } from "../util.js";

export const RenderModLog = (props) => {
  return (
    <PactJsonListAsTable
      header={["Author","Timestamp","Action"]}
      keyOrder={["author","timestamp","action"]}
      json={props.modLog}
    />
)};
