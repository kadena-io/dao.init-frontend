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
  const sendGuardianCmd = async (user, cmd) => {
      try {
        //creates transaction to send to wallet
        const toSign = {
            pactCode: cmd,
            caps: `(${kadenaAPI.contractAddress}.GUARDIAN ${JSON.stringify(user)})`,
            gasLimit: kadenaAPI.meta.gasLimit,
            chainId: kadenaAPI.meta.chainId,
            ttl: kadenaAPI.meta.ttl,
            envData: {}
        }
        //sends transaction to wallet to sign and awaits signed transaction
        const signed = await Pact.wallet.sign(toSign)
        console.log(signed)
        //sends signed transaction to blockchain
        const tx = await Pact.wallet.sendSigned(signed, kadenaAPI.meta.host)
        //set html to wait for transaction response
        //set state to wait for transaction response
        setTxStatus('pending')
        try {
          //listens to response to transaction sent
          //  note method will timeout in two minutes
          //    for lower level implementations checkout out Pact.fetch.poll() in pact-lang-api
          let res = await Pact.fetch.listen({"listen": tx.requestKeys[0]}, kadenaAPI.meta.host);
          //keep transaction response in local state
          setTx(res)
          if (res.result.status === "success"){
            //set state for transaction success
            setTxStatus('success')
          } else {
            //set state for transaction failure
            setTxStatus('failure')
          }
        } catch(e){
          console.log(e);
          //set state for transaction listening timeout
          setTxStatus('timeout')
        }
      } catch(e){
        console.log(e);
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
    }
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Field required>
          <label>Guardian Account Name</label>
          <input
            value={grd}
            onChange={e => setGrd(e.target.value)}/>
        </Form.Field>
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
        <Button
          type='submit'
          >Submit</Button>
      </Form>

    );
  }
  /*

    FRONTEND ACTIONS

      react components for corresponding tx status
        see line 318 for if/else logic

  */

  const txPending = () => {
    return (
      <Message style={{ fontSize: 20 }}>
        <Message.Header style={{ marginBottom: 10 }}>
          Transaction sent to Kadena Mainnet
        </Message.Header>
        Please wait, this box will update once the transaction is confirmed in
        about 30 seconds.
        <div style={{ margin: 20, textAlign: "center" }}>
          <Loader inline active />
        </div>
        <Message.Header style={{ marginBottom: 10 }}>
          Curious how interacting with a blockchain can be so simple?
        </Message.Header>
        <p>
          With most blockchains you need an account, a wallet, and some crypto
          in order to interact with them. Kadenas solution to this onboarding
          problem is gas stations; an account that exists only to fund gas
          payments on behalf of other users.
        </p>
        <p>
          Thanks to gas stations, interacting with Kadena can be as simple as
          filling out a web form.
        </p>
      </Message>
    );
  };

  const txSuccess = () => {
    return (
      <Message style={{ fontSize: 20 }}>
        <Message.Header style={{ marginBottom: 10 }}>Success!</Message.Header>
        <p>
          {JSON.stringify(tx.result.data) +
            " has been added to the Memory Wall."}
        </p>
        <p>
          <a href={`${kadenaAPI.explorerURL}/tx/${tx.reqKey}`}>
            View transaction in Block Explorer
          </a>
        </p>
      </Message>
    );
  };

  const txFailure = () => {
    return (
      <Message style={{ fontSize: 20 }}>
        <Message.Header style={{ marginBottom: 10 }}>
          ERROR! INVESTIGATE BELOW
        </Message.Header>
        <p>{JSON.stringify(tx)}</p>
        <p>
          <a href={`${kadenaAPI.explorerURL}/tx/${tx.reqKey}`}>
            View transaction in Block Explorer
          </a>
        </p>
      </Message>
    );
  };

  const txValidationError = () => {
    return (
      <Message style={{ fontSize: 20 }}>
        <Message.Header style={{ marginBottom: 10 }}>
          Transaction was Rejected
        </Message.Header>
        <p>
          Transaction was not sent to Blockchain. Check your keys or metadata
        </p>
      </Message>
    );
  };

  const txTimeout = () => {
    return (
      <Message style={{ fontSize: 20 }}>
        <Message.Header style={{ marginBottom: 10 }}>
          Waiting Timed out, but your tx was sent. Look up Below
        </Message.Header>
        <p>
          <a href={`${kadenaAPI.explorerURL}/tx/${tx.reqKey}`}>
            View transaction in Block Explorer
          </a>
        </p>
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

          <h2>Smart Contract Details:</h2>
          <p style={{ fontSize: 18 }}>
            <b> Address: </b> {kadenaAPI.contractAddress}
          </p>
          <p style={{ fontSize: 18 }}>
            <b> Chain: </b> {kadenaAPI.meta.chainId}
          </p>
          <p style={{ fontSize: 18 }}>
            <b> Network: </b> {kadenaAPI.meta.networkId}
          </p>
          {txStatus === "pending" ? (
            txPending()
          ) : txStatus === "success" ? (
            txSuccess()
          ) : txStatus === "timeout" ? (
            txTimeout()
          ) : txStatus === "validation-error" ? (
            txValidationError()
          ) : (
            <div />
          )}
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
