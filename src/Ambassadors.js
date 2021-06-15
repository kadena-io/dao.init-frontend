//basic React api imports
import React from "react";
//config file for blockchain calls
import { renderPactValue } from "./util.js";


export const RenderAmbassadors = (props) => {
  return (
    <table className="ui very basic collapsing celled table">
      <thead>
        <tr>
          <th>Ambassador</th>
          <th>Active</th>
          <th>Voted To Freeze</th>
          <th>Guard</th>
        </tr>
     </thead>
     <tbody>
      { props.ambassadors.map((g) => {return(
        <tr key={g["k"]}>
          <td>
            {g["k"]}
          </td>
          <td>
            {renderPactValue(g["active"])}
          </td>
          <td>
            {renderPactValue(g["voted-to-freeze"])}
          </td>
          <td>
            {renderPactValue(g["guard"])}
          </td>
        </tr>
      )})}
    </tbody>
  </table>
  )
};
