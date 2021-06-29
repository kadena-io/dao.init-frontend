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
import { NavDrawer } from "./NavDrawer.js";
import { ScrollableTabs } from "./ScrollableTabs.js";
import { BookTwoTone } from "@material-ui/icons";
import { PactTxStatus } from "./PactTxStatus.js";

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
import { InitConfig } from "./InitConfig.js"
import { RenderInitState, getContractState } from "./InitState.js";

import { ForumConfig, RenderForumState, getForumContractState } from "./Forum/ForumConfig.js";
import { MjolnirActionForms } from "./Forum/Mjolnir.js";
import { 
  RenderModerators,
  RenderMembers,
  MemberActionForms,
  ModeratorActionForms,
} from "./Forum/Members.js";
import { RenderModLog } from "./Forum/ModLog.js";


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
  
  //Init Top Level States
  const [initState, setInitState] = useState( {} );
  const [guardians, setGuardians] = useState( [] );
  const [ambassadors, setAmbassadors] = useState( [] );
  const ambTabIdx = useState(0);
  const grdTabIdx = useState(0);
  
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

  // Tx Status Top Level State
  const [txStatus, setTxStatus] = useState("");
  const [tx, setTx] = useState( {} );
  const [txRes, setTxRes] = useState( {} );
  const pactTxStatus = {
    tx:tx,setTx:setTx,
    txStatus:txStatus,setTxStatus:setTxStatus,
    txRes:txRes,setTxRes:setTxRes,
  };

  //Forum Top Level States
  const [forumState, setForumState] = useState( {} );
  const [members, setMembers] = useState([]);
  const [moderators, setModerators] = useState([]);
  const [modLog, setModLog] = useState( [] );

  //Forum UI States
  const mjolnirTabIdx = useState(0);
  const memberTabIdx = useState(0);
  const moderatorTabIdx = useState(0);

  const getForumState = async () => {
    const res = await getForumContractState("view-forum-state");
    setForumState(res);
  };

  const getMembers = async () => {
    const res = await getForumContractState("view-members");
    setMembers(res.filter(m=>m.moderator === false));
    setModerators(res.filter(m=>m.moderator === true));
  };

  const getModLog = async () => {
    const res = await getForumContractState("view-modlogs");
    setModLog(res);
  };

  const refresh = {
    getForumState: getForumState,
    getMembers: getMembers,
  }

  useEffect(() => {
    getGuardians();
    getInitState();
    getAmbassadors();
    getForumState();
    getMembers();
    getModLog();
    console.log('useEffect App.js Fired');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <NoSsr>
        <CssBaseline/>
        <Router basename={process.env.PUBLIC_URL}>
          <NavDrawer
            entriesList={[
                [{
                  primary:"dao.init",
                  subList:  
                    [{
                      primary:"Config",
                      to:"/daoConfig"
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
                },{
                  primary:"dao.forum",
                  subList:  
                    [{
                      primary:"Config",
                      to:"/forumConfig"
                    },{
                      primary:"Forum State",
                      to:"/forumState"
                    },{
                      primary:"Mod Log",
                      to:"/modlog"
                    },{
                      primary:"Mjolnir",
                      to:"/mjolnir"
                    },{
                      primary:"Moderators",
                      to:"/moderators"
                    },{
                      primary:"Members",
                      to:"/members"
                    }
                  ]
                }]
          ]}>
          <Container>
            <Switch>
              <Route path="/initConfig" component={ () =>
                <Card>
                  <CardHeader title="Contract and UI Configuration"/>
                  <CardContent>
                    <InitConfig/>
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
              <Route path="/forumConfig" component={ () =>
                <Card>
                  <CardHeader title="Contract and UI Configuration"/>
                  <CardContent>
                    <ForumConfig/>
                  </CardContent>
                </Card>
              }/>
              <Route path="/forumState" component={ () =>
                <Card>
                  <CardHeader title="Contract State"/>
                  <CardContent>
                    <RenderForumState forumState={forumState}/>
                  </CardContent>
                </Card>
              }/>
              <Route path="/mjolnir" component={ () =>
                <Card>
                  <CardHeader title="Mjolnir Powers"/>
                  <CardContent>
                    <MjolnirActionForms 
                      members={members}
                      moderators={moderators}
                      tabIdx={mjolnirTabIdx}
                      pactTxStatus={pactTxStatus}
                      refresh={refresh}
                    />
                  </CardContent>
                </Card>
              }/>
              <Route path="/moderators" component={ () =>
                <Card>
                  <CardHeader title="Moderators"/>
                  <CardContent>
                    <RenderModerators moderators={moderators}/>
                    <ModeratorActionForms
                      members={members}
                      moderators={moderators}
                      guardians={guardians}
                      ambassadors={ambassadors}
                      tabIdx={moderatorTabIdx}
                      pactTxStatus={pactTxStatus}
                      refresh={refresh}
                    />
                  </CardContent>
                </Card>
              }/>
              <Route path="/members" component={ () =>
                <Card>
                  <CardHeader title="Members"/>
                  <CardContent>
                    <RenderMembers members={members}/>
                    <MemberActionForms
                      members={members}
                      moderators={moderators}
                      guardians={guardians}
                      ambassadors={ambassadors}
                      tabIdx={memberTabIdx}
                      pactTxStatus={pactTxStatus}
                      refresh={refresh}
                    />
                  </CardContent>
                </Card>
              }/>
              <Route path="/modlog" component={ () =>
                <Card>
                  <CardHeader title="Moderation Log"/>
                  <CardContent>
                    <RenderModLog modLog={modLog}/>
                  </CardContent>
                </Card>
              }/>

            <Route path="/">
              <Redirect to="/initConfig" />
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
