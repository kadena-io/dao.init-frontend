// For util functions
import React from "react";
import {
  Table
} from "semantic-ui-react";
//config file for blockchain calls
import Pact from "pact-lang-api";
import { kadenaAPI, keyFormatter } from "./kadena-config.js";

const stringifyHelper = (k,val) => {
  return (
    typeof val === "number" ? val.toFixed() : val
  );
}

export const dashStyleNames2Text = str => str.split("-").map(k=>k.replace(new RegExp("^.","gm"),a=>a.toUpperCase())).join(' ');

const pactStringify = (json) => JSON.stringify(json, (k,v) => renderPactValue(v), 2);

const isRootPactValue = (val) => {
  if (typeof val === 'object' ) {
    if ('timep' in val || 'int' in val || 'decimal' in val || 'time' in val) {
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
      return typeof val['int'] === 'string' ? val['int'] : val['int'].toFixed();
    } else if ('decimal' in val) {
      return typeof val['decimal'] === 'string' ? val['decimal'] : val['decimal'].toFixed();
    } else {
      return JSON.stringify(val, undefined, 2);
    }
  } else if (typeof val === 'boolean') {
    return val.toString();
  } else if (typeof val === 'string') {
    return val;
  } else if (typeof val === 'number'){
    return val.toFixed()
  } else {
    return JSON.stringify(val, undefined, 2);
  }
};

export const PactSingleJsonAsTable = (props) => {
  const json = props.json || {};
  const removeMargin = props.removeMargin || false;
  const header = props.header || [];
  const keyFormatter = props.keyFormatter ? props.keyFormatter : (k) => {return (k)};
  const valFormatter = props.valFormatter ? props.valFormatter : (str) => <code>{renderPactValue(str)}</code>
    return (
      <Table simple collapsing celled style={removeMargin ? ({'margin': '0 auto', 'border-radius': '0'}) : {}}>
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
