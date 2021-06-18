// For util functions
import React from "react";
import { makeStyles } from '@material-ui/core/styles';
//Table Stuff
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
//Collapse-able Stuff
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const useNestedStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

//config file for blockchain calls

export const dashStyleNames2Text = str => str.split("-").map(k=>k.replace(new RegExp("^.","gm"),a=>a.toUpperCase())).join(' ');

const isRootPactValue = (val) => {
  if (typeof val === 'object' ) {
    if ('timep' in val || 'int' in val || 'decimal' in val || 'time' in val ) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
};

const isPactKeyset = (val) => {
  if (typeof val === 'object' ) {
    if (Object.keys(val).length === 2 &&'pred' in val && 'keys' in val) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
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
  const isNested = props.isNested || false;
  const classes = isNested ? useNestedStyles : useStyles;
  const header = props.header || [];
  const keyFormatter = props.keyFormatter ? props.keyFormatter : (k) => {return (k)};
  const valFormatter = props.valFormatter ? props.valFormatter : (str) => <code>{renderPactValue(str)}</code>;
  const internals = () =>
    <React.Fragment>
      <TableHead>
        <TableRow>
        {header.map((val) => {
          return <TableCell>{val}</TableCell>;
        })}
        </TableRow>
      </TableHead>

      <TableBody>
        {Object.entries(json).map(([k,v]) => {
          return (
          <TableRow key={k}>
            { Array.isArray(json) === false ? (
              <TableCell>{keyFormatter(k)}</TableCell>
            ) : (
              <React.Fragment></React.Fragment>
            )}
            { isRootPactValue(v) ? (
              <TableCell>{valFormatter(v)}</TableCell>
            ) : typeof v === "object" ? (
              <PactSingleJsonAsTable
                json={v}
                keyFormatter={keyFormatter}
                valFormatter={valFormatter}
                isNested={true}/>
            ) : typeof v === "function" ? (
              <TableCell>{valFormatter(v.toString())}</TableCell>
            ) : (
              <TableCell>{valFormatter(v)}</TableCell>
            )}
          </TableRow>
          )
        })}
      </TableBody>
    </React.Fragment>;

  return (
    isNested ? (
      <Table className={classes.table} size='small' aria-label="simple table">
        {internals()}
      </Table>
    ) : (
    <TableContainer component={Paper}>
      <Table className={classes.table} size='small' aria-label="simple table">
        {internals()}
      </Table>
    </TableContainer>
    )
)};

export const PactJsonListAsTable = (props) => {
  const json = props.json || {};
  const isNested = props.isNested || false;
  const classes = isNested ? useNestedStyles : useStyles;
  const header = props.header || [];
  let keyOrder = [];
  if (props.keyOrder) {
    keyOrder = props.keyOrder;
  } else if (Array.isArray(props.json)) {
    if ( json.length > 0 ) {
      keyOrder = Object.keys(json[0]);
    }
  }
  const keyFormatter = props.keyFormatter ? props.keyFormatter : (k) => {return (k)};
  const valFormatter = props.valFormatter ? props.valFormatter : (str) => <code>{renderPactValue(str)}</code>;

  const internals = () =>
    <React.Fragment>
        <TableHead>
          <TableRow>
          {header.map((val) => (
            <TableCell>{val}</TableCell>
          ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {json.map(obj => (
            <TableRow key={obj[keyOrder[0]]}>
              { keyOrder.map(k => {
                  const v = obj[k];
                  return (
                    <TableCell>
                      {isRootPactValue(v) ? (
                          valFormatter(v)
                      ) : Array.isArray(v) ? (
                          <PactJsonListAsTable
                            json={v}
                            keyFormatter={keyFormatter}
                            valFormatter={valFormatter}
                            isNested={true}/>
                      ) : typeof v === "object" ? (
                          <PactSingleJsonAsTable
                            json={v}
                            keyFormatter={keyFormatter}
                            valFormatter={valFormatter}
                            isNested={true}/>
                      ) : typeof v === "function" ? (
                          valFormatter(v.toString())
                      ) : (
                          valFormatter(v)
                      )}
                    </TableCell>
                  )
                }
            )}
            </TableRow>
          ))}
      </TableBody>
    </React.Fragment>;

  return (
    isNested ? (
      <Table className={classes.table} size='small' aria-label="simple table">
        {internals()}
      </Table>
    ) : (
    <TableContainer component={Paper}>
      <Table className={classes.table} size='small' aria-label="simple table">
        {internals()}
      </Table>
    </TableContainer>
    )
)};
