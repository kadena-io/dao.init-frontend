//basic React api imports
import React, { useState, useEffect } from "react";
//semantic ui for styling
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
//pact-lang-api for blockchain calls
import Pact from "pact-lang-api";
//config file for blockchain calls
import { kadenaAPI } from "./kadena-config.js";
import { renderPactValue } from "./util.js";
import { RenderGuardians } from "./Guardians.js";
import { RenderAmbassadors } from "./Ambassadors.js";
import { RenderInitState } from "./InitState.js";

const App = () => {
  /*

    REACT COMPONENT SETUP

      we will make use of standard react apis

      useState -> page state management
      useEffect -> fetch existing memories on page load

  */

  const [initState, setInitState] = useState( {} );
  const [guardians, setGuardians] = useState( [] );
  const [ambassadors, setAmbassadors] = useState( [] );
  const [txStatus, setTxStatus] = useState("");
  const [tx, setTx] = useState( {} );

  const getInitState = async () => {
    const res = await getContractState("view-state");
    setInitState(res);
  };

  const getAmbassadors = async () => {
    const res = await getContractState("view-ambassadors");
    setAmbassadors(res);
  };

  const getGuardians = async () => {
    const res = await getContractState("view-guardians");
    setGuardians(res);
  };

  useEffect(() => {
    getInitState();
    getAmbassadors();
    getGuardians();
  }, []);

  /*

    BLOCKCHAIN TRANSACTIONS

      use pact-lang-api npm package to interact with Kadena blockchain networks
        https://github.com/kadena-io/pact-lang-api

      all transaction setup is ./kadena-config.js

  */

  const getContractState = async (cmd) => {
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

  //send call

  //  writes memory blockchain
  //  updates frontend depending on response
  // THIS IS FOR SIGNING API CONFIG
  const sendGuardianCmd = async (user, cmd, envData) => {
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
                retries = 0;
              } else {
                retries = retries - 1;
              }
            } catch(e) {
                retries = retries - 1;
            }
          };
          //keep transaction response in local state
          setTx(res)
          if (res[signed.hash].result.status === "success"){
            console.log("tx status set to success");
            //set state for transaction success
            setTxStatus('success')
          } else {
            console.log("tx status set to failure");
            //set state for transaction failure
            setTxStatus('failure')
          }
        } catch(e){
          console.log(e);
          console.log("tx status set to timeout");
          //set state for transaction listening timeout
          setTxStatus('timeout')
        }
      } catch(e){
        console.log(e);
        console.log("tx status set to validation error");
        //set state for transaction construction error
        setTxStatus('validation-error')
      }
  }
  const AddAmbassador = (props) => {
    const [grd, setGrd] = useState( "" );
    const [newAmb, setNewAmb] = useState( "" );
    const [ambGrd, setAmbGrd] = useState( "" );

    const handleSubmit = (evt) => {
        evt.preventDefault();
        console.log(grd,newAmb,ambGrd);
        sendGuardianCmd(grd
          ,`(${kadenaAPI.contractAddress}.register-ambassador "${grd}" "${newAmb}" (read-keyset 'ks))`
          ,{ks: JSON.parse(ambGrd)})
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
              value={ambGrd}
              onChange={e => setAmbGrd(e.target.value)}
              />
            <Button color='blue' type='submit'>Submit</Button>
          </Form>
          {txStatus === "pending" ? (
            txPending()
          ) : txStatus === "success" ? (
            txSuccess()
          ) : txStatus === "failure" ? (
            txFailure()
          ) : txStatus === "timeout" ? (
            txTimeout()
          ) : txStatus === "validation-error" ? (
            txValidationError()
          ) : (
            <div />
          )}
      </div>

    );
  }
  /*

    FRONTEND ACTIONS

      react components for corresponding tx status
        see line 318 for if/else logic

  */

  const txPending = () => {
    return (
      <Message icon attached="bottom" info>
        <Icon name='circle notched' loading />
        <Message.Content>
          <Message.Header>
            Transaction Sent
          </Message.Header>
          Awaiting Confirmation
        </Message.Content>
      </Message>
    );
  };
  const txSuccess = () => {
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

  const txFailure = () => {
    return (
      <Message icon attached="bottom" error>
        <Icon name='exclaimation circle outline' />
        <Message.Content>
          <Message.Header>
            Transaction Failure
          </Message.Header>
          <p>{JSON.stringify(tx)}</p>
          <a href={`${kadenaAPI.explorerURL}/tx/${tx.hash}`}>
            View transaction in Block Explorer
          </a>
        </Message.Content>
      </Message>
    );
  };

  const txValidationError = () => {
    return (
      <Message icon attached="bottom" error>
        <Icon name='exclaimation circle outline' />
        <Message.Content>
          <Message.Header>
            Transaction Validation Failure
          </Message.Header>
          Transaction was not sent to Blockchain. Check your keys or metadata
        </Message.Content>
      </Message>
    );
  };

  const txTimeout = () => {
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


  //return react JSX
  return (
    <div>
      <Segment raised padded="very">
        <div style={{ margin: 30 }}>
          <h1>
            <a>Welcome to DAO.init</a>
          </h1>

          <table className="ui very basic collapsing celled table">
            <thead>
              <tr>
              </tr>
           </thead>
           <tbody>
             <tr>
               <td>
                 <h4>
                   Contract Address
                 </h4>
               </td>
               <td>
                  {kadenaAPI.contractAddress}
               </td>
             </tr>
             <tr>
               <td>
                 <h4>
                   Chain ID
                 </h4>
               </td>
               <td>
                  {kadenaAPI.meta.chainId}
               </td>
             </tr>
             <tr>
               <td>
                 <h4>
                   Network ID
                 </h4>
               </td>
               <td>
                  {kadenaAPI.meta.networkId}
               </td>
             </tr>
           </tbody>
          </table>
          <h2>
            Contract State
          </h2>
          <RenderInitState initState={initState}/>
          <h2>
            Guardians
          </h2>
          <RenderGuardians guardians={guardians}/>
          <h2>
            Ambassadors
          </h2>
          <RenderAmbassadors ambassadors={ambassadors}/>
          <AddAmbassador guardians={guardians}/>
        </div>
      </Segment>
    </div>
  );
};


export default App;
