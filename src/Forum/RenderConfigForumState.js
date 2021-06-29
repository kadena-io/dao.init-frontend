import React from "react";

import {
  forumAPI,
  keyFormatter
} from "../../kadena-config.js";
import {
  PactSingleJsonAsTable
} from "../../util.js";

export const RenderConfigForumState = () => {
    return (
      <PactSingleJsonAsTable
        json={forumAPI}
        keyFormatter={keyFormatter}
        />
    )
  };
  