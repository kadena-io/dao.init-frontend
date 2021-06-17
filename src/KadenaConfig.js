//basic React api imports
import React from "react";
import { kadenaAPI, keyFormatter } from "./kadena-config.js";
import { PactSingleJsonAsTable } from "./util.js";

export const KadenaConfig = () => {
  return (
    <PactSingleJsonAsTable
      json={kadenaAPI}
      keyFormatter={keyFormatter}
      />
  )
};
