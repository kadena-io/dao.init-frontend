//basic React api imports
import React, { useState, } from "react";
import clsx from 'clsx';
//Material Stuff
import {FormControl as Form} from '@material-ui/core';
import {
  Button,
  Box,
  Typography,
  IconButton,
  Input,
  FilledInput,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormHelperText,
  FormControl,
  TextField,
  MenuItem,
  Card, CardHeader, CardContent, CardActions,
  Grid,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
//pact-lang-api for blockchain calls
import Pact from "pact-lang-api";
//config file for blockchain calls
import { kadenaAPI } from "./kadena-config.js";
import {
  PactJsonListAsTable,
  useInputStyles,
 } from "./util.js";
import { PactTxStatus } from "./PactTxStatus.js"

const sendGuardianCmd = async (
  setTx,
  setTxStatus,
  setTxRes,
  refresh,
  user, cmd, envData={}
) => {
    try {
      //creates transaction to send to wallet
      const toSign = {
          pactCode: cmd,
          caps: Pact.lang.mkCap("Guadian Cap"
                           , "Authenticates that your a guardian"
                           , `${kadenaAPI.contractAddress}.GUARDIAN`
                           , [user]),
          gasLimit: kadenaAPI.meta.gasLimit,
          chainId: kadenaAPI.meta.chainId,
          ttl: kadenaAPI.meta.ttl,
          sender: user,
          envData: envData
      }
      console.log("toSign", toSign)
      //sends transaction to wallet to sign and awaits signed transaction
      const signed = await Pact.wallet.sign(toSign)
      console.log("signed", signed)
      setTx(signed)
      //sends signed transaction to blockchain
      const txReqKeys = await Pact.wallet.sendSigned(signed, kadenaAPI.meta.host)
      console.log("txReqKeys", txReqKeys)
      //set html to wait for transaction response
      //set state to wait for transaction response
      setTxStatus('pending')
      try {
        //listens to response to transaction sent
        //  note method will timeout in two minutes
        //    for lower level implementations checkout out Pact.fetch.poll() in pact-lang-api
        let retries = 8;
        let res = {};
        while (retries > 0) {
          //sleep the polling
          await new Promise(r => setTimeout(r, 15000));
          res = await Pact.fetch.poll(txReqKeys, kadenaAPI.meta.host);
          try {
            if (res[signed.hash].result.status) {
              retries = -1;
            } else {
              retries = retries - 1;
            }
          } catch(e) {
              retries = retries - 1;
          }
        };
        //keep transaction response in local state
        setTxRes(res)
        if (res[signed.hash].result.status === "success"){
          console.log("tx status set to success");
          //set state for transaction success
          setTxStatus('success');
          refresh();
        } else if (retries === 0) {
          console.log("tx status set to timeout");
          setTxStatus('timeout');
          refresh();
        } else {
          console.log("tx status set to failure");
          //set state for transaction failure
          setTxStatus('failure');
        }
      } catch(e) {
        // TODO: use break in the while loop to capture if timeout occured
        console.log("tx api failure",e);
        setTxRes(e);
        setTxStatus('failure');
      }
    } catch(e) {
      console.log(e);
      console.log("tx status set to validation error");
      //set state for transaction construction error
      setTxStatus('validation-error');
    }
};

export const RenderGuardians = (props) => {
  return (
    <PactJsonListAsTable
      header={["Guardian","Committed KDA","Approved Hash","Approval Date","Guard"]}
      keyOrder={["k","committed-kda","approved-hash","approved-date","guard"]}
      json={props.guardians}
    />
)};

export const RegisterAmbassador = (props) => {
  const [grd, setGrd] = useState( "" );
  const [newAmb, setNewAmb] = useState( "" );
  const [ambGrd, setAmbGrd] = useState( "" );
  const [txStatus, setTxStatus] = useState("");
  const [tx, setTx] = useState( {} );
  const [txRes, setTxRes] = useState( {} );

  const handleSubmit = (evt) => {
      evt.preventDefault();
      console.log(grd,newAmb,ambGrd);
      sendGuardianCmd(setTx,setTxStatus,setTxRes,props.refresh
        ,grd
        ,`(${kadenaAPI.contractAddress}.register-ambassador "${grd}" "${newAmb}" (read-keyset 'ks))`
        ,{ks: JSON.parse(ambGrd)}
        )
      };

  return (
    <Grid item xs={12} sm={6}>
    <Card>
      <CardHeader title="Add Ambassador"/>
      <CardContent>
      <form
        autoComplete="off"
        onSubmit={evt => handleSubmit(evt)}>
          <TextField
            id="outlined-multiline-static"
            select
            required
            fullWidth
            variant="outlined"
            label="Select Guardian"
            onChange={e => setGrd(e.target.value)}
            >
            {props.guardians.map((g) =>
              <MenuItem key={g['k']} value={g['k']}>
                {g.['k']}
              </MenuItem>
            )}
          </TextField>
          <TextField
            required
            fullWidth
            value={newAmb}
            label="Ambassador Accout Name"
            onChange={e => setNewAmb(e.target.value)}
            />
          <TextField
            required
            fullWidth
            label="Ambassador Account Guard"
            multiline
            rows={4}
            variant="outlined"
            placeholder={JSON.stringify({"pred":"keys-all","keys":["8c59a322800b3650f9fc5b6742aa845bc1c35c2625dabfe5a9e9a4cada32c543"]},undefined,2)}
            value={ambGrd}
            onChange={e => setAmbGrd(e.target.value)}
          />
        <CardActions>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </CardActions>
      </form>
      <PactTxStatus tx={tx} txRes={txRes} txStatus={txStatus}/>
    </CardContent>
  </Card>
  </Grid>
  );
};
//
// export const DeactivateAmbassador = (props) => {
//   const [grd, setGrd] = useState( "" );
//   const [newAmb, setNewAmb] = useState( "" );
//   const [txStatus, setTxStatus] = useState("");
//   const [tx, setTx] = useState( {} );
//   const [txRes, setTxRes] = useState( {} );
//
//   const handleSubmit = (evt) => {
//       evt.preventDefault();
//       // console.log(grd,newAmb);
//       sendGuardianCmd(setTx,setTxStatus,setTxRes,props.refresh
//         ,grd
//         ,`(${kadenaAPI.contractAddress}.deactivate-ambassador "${grd}" "${newAmb}")`
//         )
//       };
//
//   return (
//     <div>
//       <Message attached header="Deactivate Ambassador"/>
//       <Form onSubmit={(evt)=>handleSubmit(evt)} className="attached fluid segment">
//         <Form.Select
//           label="Select Guardian"
//           required
//           options={props.guardians.map((g) => {return {key: g['k'], value:g['k'], text:g['k']};})}
//           onChange={(e,d) => {setGrd(d.value)}}
//           />
//         <Form.Select
//           label="Select Ambassador"
//           required
//           options={props.ambassadors.map((g) => {return {key: g['k'], value:g['k'], text:g['k']};})}
//           onChange={e => setNewAmb(e.target.value)}/>
//         <Button color='blue' type='submit'>Submit</Button>
//       </Form>
//       <PactTxStatus tx={tx} txRes={txRes} txStatus={txStatus}/>
//     </div>
//
//   );
// };
//
// export const ReactivateAmbassador = (props) => {
//   const [grd, setGrd] = useState( "" );
//   const [amb, setAmb] = useState( "" );
//   const [txStatus, setTxStatus] = useState("");
//   const [tx, setTx] = useState( {} );
//   const [txRes, setTxRes] = useState( {} );
//
//   const handleSubmit = (evt) => {
//       evt.preventDefault();
//       // console.log(grd,newAmb);
//       sendGuardianCmd(setTx,setTxStatus,setTxRes,props.refresh
//         ,grd
//         ,`(${kadenaAPI.contractAddress}.reactivate-ambassador "${grd}" "${amb}")`
//         )
//       };
//
//   return (
//     <div>
//       <Message attached header="Reactivate Ambassador"/>
//       <Form onSubmit={evt => handleSubmit(evt)} className="attached fluid segment">
//         <Form.Select
//           label="Select Guardian"
//           required
//           options={props.guardians.map((g) => {return {key: g['k'], value:g['k'], text:g['k']};})}
//           onChange={(e,d) => {setGrd(d.value)}}
//           />
//         <Form.Select
//           label="Select Ambassador"
//           required
//           options={props.ambassadors.map((g) => {return {key: g['k'], value:g['k'], text:g['k']};})}
//           onChange={(e,d) => setAmb(d.value)}/>
//         <Button color='blue' type='submit'>Submit</Button>
//       </Form>
//       <PactTxStatus tx={tx} txRes={txRes} txStatus={txStatus}/>
//     </div>
//
//   );
// }
//
// export const RotateGuardian = (props) => {
//   const [grd, setGrd] = useState( "" );
//   const [ks, setKs] = useState( "" );
//   const [txStatus, setTxStatus] = useState( "" );
//   const [tx, setTx] = useState( {} );
//   const [txRes, setTxRes] = useState( {} );
//
//   const handleSubmit = (evt) => {
//       evt.preventDefault();
//       // console.log(grd,newAmb);
//       sendGuardianCmd(setTx,setTxStatus,setTxRes,props.refresh
//         ,grd
//         ,`(${kadenaAPI.contractAddress}.reactivate-ambassador "${grd}" (read-keyset 'ks))`
//         ,{ks: JSON.parse(ks)})
//       };
//
//   return (
//     <div>
//       <Message attached header="Rotate Guardian"/>
//       <Form onSubmit={evt => handleSubmit(evt)} className="attached fluid segment">
//         <Form.Select
//           label="Select Guardian"
//           required
//           options={props.guardians.map((g) => {return {key: g['k'], value:g['k'], text:g['k']};})}
//           onChange={(e,d) => {setGrd(d.value)}}
//           />
//         <Form.TextArea required
//           label="Enter new KeySet"
//           placeholder={JSON.stringify({"pred":"keys-all","keys":["8c59a322800b3650f9fc5b6742aa845bc1c35c2625dabfe5a9e9a4cada32c543"]},undefined,2)}
//           value={ks}
//           onChange={e => setKs(e.target.value)}
//           />
//         <Button color='blue' type='submit'>Submit</Button>
//       </Form>
//       <PactTxStatus tx={tx} txRes={txRes} txStatus={txStatus}/>
//     </div>
//
//   );
// }
