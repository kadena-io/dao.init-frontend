//basic React api imports
import React from "react";
//config file for blockchain calls
import Pact from "pact-lang-api";
import { kadenaAPI } from "./kadena-config.js";
import { renderPactValue, PactSingleJsonAsTable, dashStyleNames2Text } from "./util.js";

export const getContractState = async (cmd) => {
  //calling get-all() function from smart contract
    const res = await Pact.fetch.local(
      {
        pactCode: `(${kadenaAPI.contractAddress}.${cmd})`,
        //pact-lang-api function to construct transaction meta data
        meta: Pact.lang.mkMeta(
          kadenaAPI.meta.sender,
          kadenaAPI.meta.chainId,
          kadenaAPI.meta.gasPrice,
          kadenaAPI.meta.gasLimit,
          kadenaAPI.meta.creationTime(),
          kadenaAPI.meta.ttl
        ),
      },
      kadenaAPI.meta.host
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

//   return (
//     <table className="ui very basic collapsing celled table">
//       <thead>
//         <tr>
//           <th></th>
//           <th>Status</th>
//         </tr>
//      </thead>
//      <tbody>
//        <tr>
//          <td>
//            <h4>
//              Guardians
//            </h4>
//          </td>
//          <td>
//             { renderPactValue( props.initState["guardian-count"]) }
//          </td>
//        </tr>
//        <tr>
//          <td>
//            <h4>
//              Ambassadors
//            </h4>
//          </td>
//          <td>
//            { renderPactValue( props.initState["ambassador-count"]) }
//          </td>
//        </tr>
//        <tr>
//          <td>
//            <h4>
//              DAO Frozen Until
//            </h4>
//          </td>
//          <td>
//           { renderPactValue( props.initState["dao-frozen-until"]) }
//          </td>
//        </tr>
//        <tr>
//          <td>
//            <h4>
//              Last Ambassador Deactivation
//            </h4>
//          </td>
//          <td>
//            { renderPactValue( props.initState["last-ambassador-deactivation"]) }
//          </td>
//        </tr>
//        <tr>
//          <td>
//            <h4>
//              Proposed Upgrade Hash
//            </h4>
//          </td>
//          <td>
//            { renderPactValue( props.initState["proposed-upgrade-hash"]) }
//          </td>
//        </tr>
//        <tr>
//          <td>
//            <h4>
//              Proposed Upgrade Time
//            </h4>
//          </td>
//          <td>
//            { renderPactValue( props.initState["proposed-upgrade-time"]) }
//          </td>
//        </tr>
//      </tbody>
//    </table>
//   )
// };
