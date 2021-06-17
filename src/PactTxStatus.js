//basic React api imports
import React, { useState, useEffect } from "react";
import {
  Icon,
  Message,
} from "semantic-ui-react";
import Pact from "pact-lang-api";

import { kadenaAPI } from "./kadena-config.js";

export const PactTxStatus = (props) => {
  // TODO: make these msgs hideable
  const tx = props.tx;
  const txRes = props.txRes;
  const txStatus = props.txStatus;

  return (
    <div>
    { txStatus === "pending" ? (
      txPending(tx)
    ) : txStatus === "success" ? (
      txSuccess(tx)
    ) : txStatus === "failure" ? (
      txFailure(tx,txRes)
    ) : txStatus === "timeout" ? (
      txTimeout(tx)
    ) : txStatus === "validation-error" ? (
      txValidationError(tx,txRes)
    ) : (
      <div />
    )}
    </div>
  )

}

const txPending = (tx) => {
  return (
    <Message icon attached="bottom" info>
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
const txSuccess = (tx) => {
  return (
    <Message icon attached="bottom" info>
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

const txFailure = (tx,txRes) => {
  return (
    <Message icon attached="bottom" error>
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

const txValidationError = (tx, txRes) => {
  return (
    <Message icon attached="bottom" error>
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

const txTimeout = (tx) => {
  return (
    <Message icon attached="bottom" warning>
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
