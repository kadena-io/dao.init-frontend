//basic React api imports
import React from "react";

import Pact from "pact-lang-api";
import { forumAPI, keyFormatter } from "../kadena-config.js";
import { PactSingleJsonAsTable, dashStyleNames2Text } from "../util.js";

export const getForumContractState = async (cmd) => {
  //calling get-all() function from smart contract
    const res = await Pact.fetch.local(
      {
        pactCode: `(${forumAPI.contractAddress}.${cmd})`,
        //pact-lang-api function to construct transaction meta data
        meta: Pact.lang.mkMeta(
          forumAPI.meta.sender,
          forumAPI.meta.chainId,
          forumAPI.meta.gasPrice,
          forumAPI.meta.gasLimit,
          forumAPI.meta.creationTime(),
          forumAPI.meta.ttl
        ),
      },
      forumAPI.meta.host
    );
    const all = res.result.data;
    //sorts memories by least recent
    console.log(`local query data: (${forumAPI.contractAddress}.${cmd})`, res);
    return(all);
};

export const RenderForumState = (props) => {
  return (
   <PactSingleJsonAsTable
    json={props.forumState}
    header={["","Status"]}
    keyFormatter={dashStyleNames2Text}
    />
  )
};
export const ForumConfig = () => {
  return (
    <PactSingleJsonAsTable
      json={forumAPI}
      keyFormatter={keyFormatter}
      />
  )
};
