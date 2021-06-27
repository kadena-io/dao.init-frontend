//basic React api imports
import React from "react";
import { daoAPI, keyFormatter } from "./kadena-config.js";
import { PactSingleJsonAsTable } from "./util.js";

export const InitConfig = () => {
  return (
    <PactSingleJsonAsTable
      json={daoAPI}
      keyFormatter={keyFormatter}
      />
  )
};
