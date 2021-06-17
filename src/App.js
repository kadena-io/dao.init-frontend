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
import { RenderGuardians, RegisterAmbassador } from "./Guardians.js";
import { RenderAmbassadors } from "./Ambassadors.js";
import { PactTxStatus } from "./PactTxStatus.js"
import { KadenaConfig } from "./KadenaConfig.js"
import { RenderInitState, getContractState } from "./InitState.js";

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


  return (
    <Segment>
      <h1>
        <a>Welcome to DAO.init</a>
      </h1>
      <KadenaConfig/>
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
        <RegisterAmbassador guardians={guardians}/>
    </Segment>
  );
};


export default App;
