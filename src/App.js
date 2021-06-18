//basic React api imports
import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
//semantic ui for styling
import {
  Container,
  Divider,
  Segment,
} from "semantic-ui-react";
import styled from "styled-components";

//config file for blockchain calls
import  {
  RenderGuardians,
  RegisterAmbassador,
  DeactivateAmbassador,
  ReactivateAmbassador,
  RotateGuardian,
} from "./Guardians.js";
import { RenderAmbassadors } from "./Ambassadors.js";
import { KadenaConfig } from "./KadenaConfig.js";
import { RenderInitState, getContractState } from "./InitState.js";
import HeaderMenu from "./HeaderMenu";

const Home = () => <h1>Welcome to dao.init</h1>;
const MissingPage = () => <h1>URL doesn't exist</h1>;

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`;



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
    <React.Fragment>
      <HeaderMenu
        onItemClick={item => this.onItemClick(item)}
        items={[
          ["Home", "/"],
          ["Config", "/KadenaConfig"],
          ["Init State", "/InitState"],
          ["Guardians", "/Guardians"],
          ["Ambassadors", "/Ambassadors"],
        ]}
        headerIcon={"compass outline"}
      />
      <Divider />
      <Segment>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/KadenaConfig" component={() =>
              <KadenaConfig/>} />
          <Route path="/InitState" component={() =>
              <RenderInitState initState={initState}/>} />
          <Route path="/Guardians" component={() =>
              <RenderGuardians guardians={guardians}/>} />
          <Route path="/Ambassadors" component={() =>
              <RenderAmbassadors ambassadors={ambassadors}/>} />
          <Route component={MissingPage} />
        </Switch>
      </Segment>
    </React.Fragment>
  );
};


    //   <h1>
    //     <a>Welcome to DAO.init</a>
    //   </h1>
    //
    //   <RegisterAmbassador
    //     guardians={guardians}
    //     refresh={() => getAmbassadors()}/>
    //   <ReactivateAmbassador
    //     guardians={guardians}
    //     ambassadors={ambassadors}
    //     refresh={() => getAmbassadors()}/>
    //   <DeactivateAmbassador
    //     guardians={guardians}
    //     ambassadors={ambassadors}
    //     refresh={() => getAmbassadors()}/>
    //   <RotateGuardian
    //     guardians={guardians}
    //     refresh={() => getGuardians()}/>
    // </React.Fragment>
    //

export default App;
