//basic React api imports
import React, { useState } from "react";
import {
  Segment,
  Input,
  Form,
  Button,
  Select,
  Feed,
  Dropdown,
  Icon,
  Message,
  Loader,
} from "semantic-ui-react";
import Pact from "pact-lang-api";

import { kadenaAPI } from "./kadena-config.js";

export const PactTxStatus = (props) => {
  // TODO: make these msgs hideable
  const [hideTx,setHideTx] = useState( false );
  const tx = props.tx;
  const txRes = props.res;
  const txStatus = props.txStatus;

  return (
    <div key={tx.hash}>
    { txStatus === "pending" ? (
      txPending(tx,setHideTx)
    ) : txStatus === "success" ? (
      txSuccess(tx,setHideTx)
    ) : txStatus === "failure" ? (
      txFailure(tx,txRes,setHideTx)
    ) : txStatus === "timeout" ? (
      txTimeout(tx,setHideTx)
    ) : txStatus === "validation-error" ? (
      txValidationError(tx,txRes,setHideTx)
    ) : (
      <div />
    )}
    </div>
  )

}

const txPending = (tx, setHideTx) => {
  return (
    <Message icon attached="bottom" info onDismiss={setHideTx(true)}>
      <Icon name='circle notched' loading />
      <Message.Content>
        <Message.Header>
          Transaction Sent
        </Message.Header>
        <p>Awaiting Confirmation</p>
        <a href={`${kadenaAPI.explorerURL}/tx/${tx.hash}`}>
          View transaction in Block Explorer
        </a>
      </Message.Content>
    </Message>
  );
};
const txSuccess = (tx, setHideTx) => {
  return (
    <Message icon attached="bottom" info onDismiss={setHideTx(true)}>
      <Icon name='check square outline' />
      <Message.Content>
        <Message.Header>
          Transaction Confirmed
        </Message.Header>
        <a href={`${kadenaAPI.explorerURL}/tx/${tx.hash}`}>
          View transaction in Block Explorer
        </a>
      </Message.Content>
    </Message>
  );
};

const txFailure = (tx,txRes, setHideTx) => {
  return (
    <Message icon attached="bottom" error onDismiss={setHideTx(true)}>
      <Icon name='exclamation' />
      <Message.Content>
        <Message.Header>
          Transaction Failure
        </Message.Header>
        <p>{JSON.stringify(txRes,undefined,2)}</p>
        <a href={`${kadenaAPI.explorerURL}/tx/${tx.hash}`}>
          View transaction in Block Explorer
        </a>
      </Message.Content>
    </Message>
  );
};

const txValidationError = (tx, txRes, setHideTx) => {
  return (
    <Message icon attached="bottom" error onDismiss={setHideTx(true)}>
      <Icon name='exclamation' />
      <Message.Content>
        <Message.Header>
          Transaction Validation Failure
        </Message.Header>
        Transaction was not sent to Blockchain. Check your keys or metadata
      </Message.Content>
    </Message>
  );
};

const txTimeout = (tx, setHideTx) => {
  return (
    <Message icon attached="bottom" warning onDismiss={setHideTx(true)}>
      <Icon name='hourglass outline' />
      <Message.Content>
        <Message.Header>
          Transaction Timeout
        </Message.Header>
        ...but your tx was sent.
        <a href={`${kadenaAPI.explorerURL}/tx/${tx.hash}`}>
          View transaction in Block Explorer
        </a>
      </Message.Content>
    </Message>
  );
};
