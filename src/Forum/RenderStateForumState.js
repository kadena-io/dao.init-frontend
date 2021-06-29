import React from "react";

import {
  dashStyleNames2Text,
  PactSingleJsonAsTable
} from "../../util.js";

export const RenderStateForumState = (props) => {
      return (
      <PactSingleJsonAsTable
        json={props.ForumState}
        keyFormatter={dashStyleNames2Text}
        />
      )
    };