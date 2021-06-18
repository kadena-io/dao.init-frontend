//basic React api imports
import React, {useState} from "react";
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';

import { kadenaAPI } from "./kadena-config.js";
import {dashStyleNames2Text} from "./util.js";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export const PactTxStatus = (props) => {
  // TODO: make these msgs hideable
  const tx = props.tx;
  const txRes = props.txRes;
  const txStatus = props.txStatus;
  const [open,setOpen] = useState(true);
  const classes = useStyles();
  const severity = txStatus === "pending" ? 'info'
                   : txStatus === "success" ? 'success'
                   : txStatus === "timeout" ? 'warning'
                   : 'error' ;

  return (
    <div className={classes.root}>
      <Collapse in={open}>
        <Alert
          severity={severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {setOpen(false);}}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >

        <AlertTitle>{dashStyleNames2Text(txStatus)}</AlertTitle>
          { txStatus === "pending" ? (
            <React.Fragment>
              <p>Awaiting Confirmation</p>
              <a href={`${kadenaAPI.explorerURL}/tx/${tx.hash}`}>
                Eventual Block Explorer Link
              </a>
            </React.Fragment>
          ) : txStatus === "success" ? (
            <React.Fragment>
              <a href={`${kadenaAPI.explorerURL}/tx/${tx.hash}`}>
                View transaction in Block Explorer
              </a>
            </React.Fragment>
          ) : txStatus === "failure" ? (
            <React.Fragment>
              <p>{JSON.stringify(txRes,undefined,2)}</p>
              <a href={`${kadenaAPI.explorerURL}/tx/${tx.hash}`}>
                View transaction in Block Explorer
              </a>
            </React.Fragment>
          ) : txStatus === "timeout" ? (
            <React.Fragment>
              <p>...but your tx was sent.</p>
              <a href={`${kadenaAPI.explorerURL}/tx/${tx.hash}`}>
                View transaction in Block Explorer
              </a>
            </React.Fragment>
          ) : txStatus === "validation-error" ? (
            <p>
              Transaction was not sent to Blockchain. Check your keys or metadata
            </p>
          ) : (
            <React.Fragment></React.Fragment>
          )}
        </Alert>
      </Collapse>
    </div>
  );
};
