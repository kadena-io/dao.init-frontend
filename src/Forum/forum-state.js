import React from "react";
import Pact from "Pact";

import {
  forumAPI,
  keyFormatter
} from "../../kadena-config.js";
import {
  PactSingleJsonAsTable,
  dashStyleNames2Text
} from "../../util.js";

\\ autogen: RenderConfigForumState
export const RenderConfigForumState = () => {
    return (
      <PactSingleJsonAsTable
        json={forumAPI}
        keyFormatter={keyFormatter}
        />
    )
  };
  

\\ autogen: fetchStateForumState
export const fetchStateForumState = async (cmd) => {
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
        console.log(`local query data: (${forumAPI.contractAddress}.${cmd})`, all);
        return(all);
    };
    

\\ autogen: RenderStateForumState
export const RenderStateForumState = (props) => {
      return (
      <PactSingleJsonAsTable
        json={props.ForumState}
        keyFormatter={dashStyleNames2Text}
        />
      )
    };