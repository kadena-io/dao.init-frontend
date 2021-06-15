//basic React api imports
import React from "react";
//config file for blockchain calls
import { renderPactValue } from "./util.js";

export const RenderInitState = (props) => {
  return (
    <table className="ui very basic collapsing celled table">
      <thead>
        <tr>
          <th></th>
          <th>Status</th>
        </tr>
     </thead>
     <tbody>
       <tr>
         <td>
           <h4>
             Guardians
           </h4>
         </td>
         <td>
            { renderPactValue( props.initState["guardian-count"]) }
         </td>
       </tr>
       <tr>
         <td>
           <h4>
             Ambassadors
           </h4>
         </td>
         <td>
           { renderPactValue( props.initState["ambassador-count"]) }
         </td>
       </tr>
       <tr>
         <td>
           <h4>
             DAO Frozen Until
           </h4>
         </td>
         <td>
          { renderPactValue( props.initState["dao-frozen-until"]) }
         </td>
       </tr>
       <tr>
         <td>
           <h4>
             Last Ambassador Deactivation
           </h4>
         </td>
         <td>
           { renderPactValue( props.initState["last-ambassador-deactivation"]) }
         </td>
       </tr>
       <tr>
         <td>
           <h4>
             Proposed Upgrade Hash
           </h4>
         </td>
         <td>
           { renderPactValue( props.initState["proposed-upgrade-hash"]) }
         </td>
       </tr>
       <tr>
         <td>
           <h4>
             Proposed Upgrade Time
           </h4>
         </td>
         <td>
           { renderPactValue( props.initState["proposed-upgrade-time"]) }
         </td>
       </tr>
     </tbody>
   </table>
  )
};
