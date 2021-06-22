//basic React api imports
import React, { useState, useEffect } from "react";
import {
  MemoryRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import {
  createMuiTheme,
  ThemeProvider,
 } from '@material-ui/core/styles';
//semantic ui for styling
import {
  Button,
  Container,
  Card, CardHeader, CardContent,
  CssBaseline, NoSsr
} from '@material-ui/core';
//config file for blockchain calls
import  {
  RegisterGuardian,
  RenderGuardians,
  RegisterAmbassador,
  DeactivateAmbassador,
  ReactivateAmbassador,
  RotateGuardian,
  ProposeDaoUpgrade,
  GuardianApproveHash,
} from "./Guardians.js";
import {
  RenderAmbassadors,
  RotateAmbassador,
  VoteToFreeze,
  Freeze,
} from "./Ambassadors.js";
import { KadenaConfig } from "./KadenaConfig.js"
import { RenderInitState, getContractState } from "./InitState.js";
import { NavDrawer } from "./NavDrawer.js";
import { ScrollableTabs } from "./ScrollableTabs.js";
import { BookTwoTone } from "@material-ui/icons";
import { PactTxStatus } from "./PactTxStatus.js";


const App = () => {
  const theme = React.useMemo(
      () =>
        createMuiTheme({
          palette: {
            primary: {
              light: '#cb4584',
              main: '#960057',
              dark: '#cb4584',
              contrastText: '#fff',
            },
            secondary: {
              light: '#ffffff',
              main: '#e3e8ed',
              dark: '#b1b6bb',
              contrastText: '#000',
            },
          },
        }),
      [],
    );

  const [initState, setInitState] = useState( {} );
  const [guardians, setGuardians] = useState( [] );
  const [ambassadors, setAmbassadors] = useState( [] );
  const ambTabIdx = useState(0);
  const grdTabIdx = useState(0);
  const [txStatus, setTxStatus] = useState("");
  const [tx, setTx] = useState( {} );
  const [txRes, setTxRes] = useState( {} );
  const pactTxStatus = {
    tx:tx,setTx:setTx,
    txStatus:txStatus,setTxStatus:setTxStatus,
    txRes:txRes,setTxRes:setTxRes,
  };

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
    getGuardians();
    getInitState();
    getAmbassadors();
    console.log('useEffect []',guardians,ambassadors)
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <NoSsr>
        <CssBaseline/>
        <Router basename={process.env.PUBLIC_URL}>
          <NavDrawer title="dao.init"
            entriesList={[
              [{
                primary:"Config",
                to:"/config"
              },{
                primary:"Init State",
                to:"/initState"
              },{
                primary:"Ambassadors",
                to:"/ambassadors"
              },{
                primary:"Guardians",
                to:"/guardians",
              }
            ]
          ]}>
          <Container>
            <Switch>
              <Route path="/config" component={ () =>
                <Card>
                  <CardHeader title="Contract and UI Configuration"/>
                  <CardContent>
                    <KadenaConfig/>
                  </CardContent>
                </Card>
              }/>
            <Route path="/initState" component={ () =>
                <Card>
                  <CardHeader title="Contract State"/>
                  <CardContent>
                    <RenderInitState initState={initState}/>
                  </CardContent>
                </Card>
              }/>
            <Route path="/guardians" component={ () =>
              <Card>
                <CardHeader title="Guardians"/>
                <CardContent>
                  <Button onClick={()=>getGuardians()}>getGuardians</Button>
                  <RenderGuardians guardians={guardians}/>
                  <ScrollableTabs
                    tabIdx={grdTabIdx}
                    tabEntries={[
                        {
                          label:"Register Guardian",
                          component:
                            <RegisterGuardian
                              pactTxStatus={pactTxStatus}
                              refresh={() => getGuardians()}/>
                        },{
                          label:"Rotate Guardian",
                          component:
                            <RotateGuardian
                              guardians={guardians}
                              ambassadors={ambassadors}
                              pactTxStatus={pactTxStatus}
                              refresh={() => getAmbassadors()}/>
                        },{
                          label:"Propose DAO Upgrade",
                          component:
                            <ProposeDaoUpgrade
                              guardians={guardians}
                              pactTxStatus={pactTxStatus}
                              refresh={() => getAmbassadors()}/>
                        },{
                          label:"Approve DAO Upgrade",
                          component:
                            <GuardianApproveHash
                              guardians={guardians}
                              pactTxStatus={pactTxStatus}
                              refresh={() => getAmbassadors()}/>
                        }
                    ]}/>
                </CardContent>
              </Card>
              }/>
            <Route path="/ambassadors" component={ () =>
              <Card>
                <CardHeader title="Ambassadors"/>
                <CardContent>
                  <RenderAmbassadors ambassadors={ambassadors}/>
                  <ScrollableTabs
                    tabIdx={ambTabIdx}
                    tabEntries={[
                      {
                        label:"Register Ambassador",
                        component:
                          <RegisterAmbassador
                            guardians={guardians}
                            pactTxStatus={pactTxStatus}
                            refresh={() => getAmbassadors()}/>
                      },{
                        label:"Deactivate Ambassador",
                        component:
                          <DeactivateAmbassador
                            guardians={guardians}
                            ambassadors={ambassadors}
                            pactTxStatus={pactTxStatus}
                            refresh={() => getAmbassadors()}/>
                      },{
                        label:"Reactivate Ambassador",
                        component:
                          <ReactivateAmbassador
                            guardians={guardians}
                            ambassadors={ambassadors}
                            pactTxStatus={pactTxStatus}
                            refresh={() => getAmbassadors()}/>
                      },{
                        label:"Rotate Ambassador",
                        component:
                          <RotateAmbassador
                            ambassadors={ambassadors}
                            pactTxStatus={pactTxStatus}
                            refresh={() => getAmbassadors()}/>
                      },{
                        label:"Vote to Freeze",
                        component:
                          <VoteToFreeze
                            ambassadors={ambassadors}
                            pactTxStatus={pactTxStatus}
                            refresh={() => getAmbassadors()}/>
                      },{
                        label:"Freeze",
                        component:
                          <Freeze
                            ambassadors={ambassadors}
                            pactTxStatus={pactTxStatus}
                            refresh={() => getAmbassadors()}/>
                      }
                    ]}/>
                </CardContent>
              </Card>
              }/>  
              <Route path="/">
                <Redirect to="/config" />
              </Route>
            </Switch>
          </Container>
          </NavDrawer>
        </Router>
      </NoSsr>
    </ThemeProvider>
  );
};

export default App;
