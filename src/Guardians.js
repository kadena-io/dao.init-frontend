//basic React api imports
import React, { useState } from "react";
//semantic ui for styling
import {
  Form,
  Dropdown,
  Icon,
  Message,
  Button,
} from "semantic-ui-react";
//pact-lang-api for blockchain calls
import Pact from "pact-lang-api";
//config file for blockchain calls
import { kadenaAPI } from "./kadena-config.js";
import { renderPactValue } from "./util.js";
import { PactTxStatus } from "./PactTxStatus.js"

const sendGuardianCmd = async (user, cmd, envData, setTx, setTxStatus, setTxRes) => {
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
          envData: envData || {}
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
        } else if (retries == 0) {
          console.log("tx status set to timeout");
          setTxStatus('timeout');
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
    } catch(e){
      console.log(e);
      console.log("tx status set to validation error");
      //set state for transaction construction error
      setTxStatus('validation-error')
    }
}
export const RenderGuardians = (props) => {
  return (
    <table className="ui very basic collapsing celled table">
      <thead>
        <tr>
          <th>Guardian</th>
          <th>Committed KDA</th>
          <th>Approved Hash</th>
          <th>Approval Date</th>
          <th>Guard</th>
        </tr>
     </thead>
     <tbody>
      { props.guardians.map((g) => {return(
        <tr key={g["k"]}>
          <td>
            {g["k"]}
          </td>
          <td>
            {renderPactValue(g["committed-kda"])}
          </td>
          <td>
            {g["approved-hash"]}
          </td>
          <td>
            {renderPactValue(g["approved-date"])}
          </td>
          <td>
            {renderPactValue(g["guard"])}
          </td>
        </tr>
      )})}
    </tbody>
  </table>
  )
};

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
      sendGuardianCmd(grd
        ,`(${kadenaAPI.contractAddress}.register-ambassador "${grd}" "${newAmb}" (read-keyset 'ks))`
        ,{ks: JSON.parse(ambGrd)}
        ,setTx,setTxStatus,setTxRes)
      };

  return (
    <div>
      <Message attached header="Add Ambassador"/>
        <Form onSubmit={handleSubmit} className="attached fluid segment">
          <Dropdown
            fluid
            search
            selection
            placeholder="Select Guardian"
            required
            options={props.guardians.map((g) => {return {key: g['k'], value:g['k'], text:g['k']};})}
            onChange={(e,d) => {setGrd(d.value)}}
            >
          </Dropdown>
          <Form.Field required>
            <label>Ambassador Account Name</label>
            <input
              value={newAmb}
              onChange={e => setNewAmb(e.target.value)}/>
          </Form.Field>
          <Form.TextArea required
            label="Ambassador Account Guard"
            placeholder={JSON.stringify({"pred":"keys-all","keys":["8c59a322800b3650f9fc5b6742aa845bc1c35c2625dabfe5a9e9a4cada32c543"]},undefined,2)}
            value={ambGrd}
            onChange={e => setAmbGrd(e.target.value)}
            />
          <Button color='blue' type='submit'>Submit</Button>
        </Form>
        <PactTxStatus tx={tx} txRes={txRes} txStatus={txStatus}/>
    </div>

  );
}
