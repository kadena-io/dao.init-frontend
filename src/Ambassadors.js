//basic React api imports
import React from "react";
//config file for blockchain calls
import { PactJsonListAsTable } from "./util.js";


export const RenderAmbassadors = (props) => {
  return (
    <PactJsonListAsTable
      header={["Ambassador","Active","Voted to Freeze","Guard"]}
      keyOrder={["k","active","voted-to-freeze","guard"]}
      json={props.ambassadors}
    />
)};
