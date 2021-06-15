//basic React api imports
import React from "react";
//config file for blockchain calls
import { renderPactValue } from "./util.js";


export const RenderGuardians = (props) => {
  return (
    <table className="ui very basic collapsing celled table">
      <thead>
        <tr>
          <th>Guardian</th>
          <th>Committed KDA</th>
          <th>Approved Hash</th>
          <th>Approval Date</th>
          <th>Guard</th>
        </tr>
     </thead>
     <tbody>
      { props.guardians.map((g) => {return(
        <tr key={g["k"]}>
          <td>
            {g["k"]}
          </td>
          <td>
            {renderPactValue(g["committed-kda"])}
          </td>
          <td>
            {g["approved-hash"]}
          </td>
          <td>
            {renderPactValue(g["approved-date"])}
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
