//basic React api imports
import React from "react";
//config file for blockchain calls
import Pact from "pact-lang-api";
import { daoAPI } from "../kadena-config.js";
import { PactSingleJsonAsTable, dashStyleNames2Text } from "../util.js";

export const getContractState = async (cmd) => {
  //calling get-all() function from smart contract
    const res = await Pact.fetch.local(
      {
        pactCode: `(${daoAPI.contractAddress}.${cmd})`,
        //pact-lang-api function to construct transaction meta data
        meta: Pact.lang.mkMeta(
          daoAPI.meta.sender,
          daoAPI.meta.chainId,
          daoAPI.meta.gasPrice,
          daoAPI.meta.gasLimit,
          daoAPI.meta.creationTime(),
          daoAPI.meta.ttl
        ),
      },
      daoAPI.meta.host
    );
    const all = res.result.data;
    //sorts memories by least recent
    console.log("local query data",all);
    return(all);
};

export const RenderInitState = (props) => {
  return (
   <PactSingleJsonAsTable
    json={props.initState}
    header={["","Status"]}
    keyFormatter={dashStyleNames2Text}
    />
  )
};
