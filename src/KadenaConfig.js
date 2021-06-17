//basic React api imports
import React from "react";
import {
  Table
} from "semantic-ui-react";
//config file for blockchain calls
import Pact from "pact-lang-api";
import { kadenaAPI, keyFormatter } from "./kadena-config.js";
import { renderPactValue } from "./util.js";

export const KadenaConfig = () => {
  return (
    <PactSingleJsonAsTable
      json={kadenaAPI}
      keyFormatter={keyFormatter}
      />
  )
};

export const PactSingleJsonAsTable = (props) => {
  const json = props.json || {};
  const removeMargin = props.removeMargin || false;
  const header = props.header || [];
  const keyFormatter = props.keyFormatter ? props.keyFormatter : (k) => {return (k)};
  const valFormatter = props.valFormatter ? props.valFormatter : (str) => <code>{renderPactValue(str)}</code>
    return (
      <Table simple collapsing style={removeMargin ? ({margin: '0 auto'}) : {}}>
        <Table.Header>
          <Table.Row>
          {header.map((val) => {
            return <Table.HeaderCell>val</Table.HeaderCell>;
          })}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {Object.entries(json).map(([k,v]) => {
            return (
            <Table.Row>
              <Table.Cell><h4>{keyFormatter(k)}</h4></Table.Cell>
              { typeof v === "object" ? (
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
