// For util functions
import React from "react";
import {
  Table
} from "semantic-ui-react";
//config file for blockchain calls

export const dashStyleNames2Text = str => str.split("-").map(k=>k.replace(new RegExp("^.","gm"),a=>a.toUpperCase())).join(' ');

const isRootPactValue = (val) => {
  if (typeof val === 'object' ) {
    if ('timep' in val || 'int' in val || 'decimal' in val || 'time' in val || ('pred' in val && 'keys' in val)) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
};


export const renderPactValue = (val) => {
  if (typeof val === 'object' ) {
    if ('time' in val) {
      return val['time'];
    } else if ('timep' in val) {
      return val['timep'];
    } else if ('int' in val) {
      return typeof val['int'] === 'string' ? val['int'] : val['int'].toLocaleString();
    } else if ('decimal' in val) {
      return typeof val['decimal'] === 'string' ? val['decimal'] : val['decimal'].toLocaleString();
    } else if ('pred' in val && 'keys' in val) {
      return JSON.stringify(val);
    } else {
      return JSON.stringify(val);
    }
  } else if (typeof val === 'boolean') {
    return val.toString();
  } else if (typeof val === 'string') {
    return val;
  } else if (typeof val === 'number'){
    return val.toLocaleString()
  } else {
    return JSON.stringify(val);
  }
};

export const PactSingleJsonAsTable = (props) => {
  const json = props.json || {};
  const removeMargin = props.removeMargin || false;
  const header = props.header || [];
  const keyFormatter = props.keyFormatter ? props.keyFormatter : (k) => {return (k)};
  const valFormatter = props.valFormatter ? props.valFormatter : (str) => <code>{renderPactValue(str)}</code>
    return (
      <Table simple collapsing celled style={removeMargin ? ({'margin': '0 auto', 'border-radius': '0', 'border-bottom':'0','border-right':'0'}) : {}}>
        <Table.Header>
          <Table.Row>
          {header.map((val) => {
            return <Table.HeaderCell>{val}</Table.HeaderCell>;
          })}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {Object.entries(json).map(([k,v]) => {
            return (
            <Table.Row>
              <Table.Cell><h4>{keyFormatter(k)}</h4></Table.Cell>
              { isRootPactValue(v) ? (
                <Table.Cell>{valFormatter(v)}</Table.Cell>
              ) : typeof v === "object" ? (
                <PactSingleJsonAsTable
                  json={v}
                  keyFormatter={keyFormatter}
                  valFormatter={valFormatter}
                  removeMargin={true}/>
              ) : typeof v === "function" ? (
                <Table.Cell>{valFormatter(v.toString())}</Table.Cell>
              ) : (
                <Table.Cell>{valFormatter(v)}</Table.Cell>
              )}
            </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    )
};

export const PactJsonListAsTable = (props) => {
  const json = props.json || {};
  const removeMargin = props.removeMargin || false;
  const header = props.header || [];
  let keyOrder = [];
  if (props.keyOrder) {
    keyOrder = props.keyOrder;
  } else if (Array.isArray(props.json)) {
    if ( json.length > 0 ) {
      keyOrder = Object.keys(json[0]);
    }
  }
  console.log("PactJsonListAsTable",json, header, keyOrder);
  const keyFormatter = props.keyFormatter ? props.keyFormatter : (k) => {return (k)};
  const valFormatter = props.valFormatter ? props.valFormatter : (str) => <code>{renderPactValue(str)}</code>
    return (
      <Table simple collapsing celled style={removeMargin ? ({'margin': '0 auto', 'borderRadius': '0', 'borderBottom':'0','borderRight':'0'}) : {}}>
        <Table.Header>
          <Table.Row>
          {header.map((val) => {
            return <Table.HeaderCell>{val}</Table.HeaderCell>;
          })}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {json.map(obj => {
            return (
              <Table.Row>
              { keyOrder.map(k => {
                  const v = obj[k];
                  return (
                    isRootPactValue(v) ? (
                      <Table.Cell>{valFormatter(v)}</Table.Cell>
                    ) : Array.isArray(v) ? (
                      <Table.Cell style={{'margin': '0 auto', 'borderRadius': '0', 'borderBottom':'0','borderRight':'0', 'padding':'0'}}>
                      <PactJsonListAsTable
                        json={v}
                        keyFormatter={keyFormatter}
                        valFormatter={valFormatter}
                        removeMargin={true}/>
                      </Table.Cell>
                    ) : typeof v === "object" ? (
                      <Table.Cell style={{'margin': '0 auto', 'borderRadius': '0', 'borderBottom':'0','borderRight':'0', 'padding':'0'}}>
                      <PactSingleJsonAsTable
                        json={v}
                        keyFormatter={keyFormatter}
                        valFormatter={valFormatter}
                        removeMargin={true}/>
                      </Table.Cell>
                    ) : typeof v === "function" ? (
                      <Table.Cell>{valFormatter(v.toString())}</Table.Cell>
                    ) : (
                      <Table.Cell>{valFormatter(v)}</Table.Cell>
                    )
                  )
                }
            )}
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
)}
//           })}
//             return (
//             <Table.Row>
//               <Table.Cell><h4>{keyFormatter(k,v)}</h4></Table.Cell>
//               { isRootPactValue(v) ? (
//                 <Table.Cell>{valFormatter(v)}</Table.Cell>
//               ) : typeof v === "object" ? (
//                 <PactSingleJsonAsTable
//                   json={v}
//                   keyFormatter={keyFormatter}
//                   valFormatter={valFormatter}
//                   removeMargin={true}/>
//               ) : typeof v === "function" ? (
//                 <Table.Cell>{valFormatter(v.toString())}</Table.Cell>
//               ) : (
//                 <Table.Cell>{valFormatter(v)}</Table.Cell>
//               )}
//             </Table.Row>
//             )
//           })}
//         </Table.Body>
//       </Table>
//     )
// };
