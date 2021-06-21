//basic React api imports
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  createMuiTheme,
  ThemeProvider,
 } from '@material-ui/core/styles';
import NoSsr from '@material-ui/core/NoSsr';
//semantic ui for styling
import {
  Container,
  Card, CardHeader, CardContent, CardActions,
  Typography,
} from '@material-ui/core';
//config file for blockchain calls
import  {
  RenderGuardians,
  RegisterAmbassador,
  DeactivateAmbassador,
  ReactivateAmbassador,
  RotateGuardian,
} from "./Guardians.js";
import { RenderAmbassadors } from "./Ambassadors.js";
import { KadenaConfig } from "./KadenaConfig.js"
import { RenderInitState, getContractState } from "./InitState.js";
import { NavDrawer } from "./NavDrawer.js";
import { ScrollableTabs } from "./ScrollableTabs.js";


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
                  <RenderGuardians guardians={guardians}/>
                  <ScrollableTabs
                    tabEntries={[
                      {
                        label:"Rotate Guardian",
                        component:
                          <DeactivateAmbassador
                            guardians={guardians}
                            ambassadors={ambassadors}
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
                    tabEntries={[
                      {
                        label:"Register Ambassador",
                        component:
                          <RegisterAmbassador
                            guardians={guardians}
                            refresh={() => getAmbassadors()}/>
                      },{
                        label:"Deactivate Ambassador",
                        component:
                          <DeactivateAmbassador
                            guardians={guardians}
                            ambassadors={ambassadors}
                            refresh={() => getAmbassadors()}/>
                      },{
                        label:"Reactivate Ambassador",
                        component:
                          <ReactivateAmbassador
                            guardians={guardians}
                            ambassadors={ambassadors}
                            refresh={() => getAmbassadors()}/>
                      }
                    ]}/>
                </CardContent>
              </Card>
              }/>
            </Switch>
          </Container>
          </NavDrawer>
        </Router>
      </NoSsr>
    </ThemeProvider>
  );
};

      // <ReactivateAmbassador
      //   guardians={guardians}
      //   ambassadors={ambassadors}
      //   refresh={() => getAmbassadors()}/>
      // <DeactivateAmbassador
      //   guardians={guardians}
      //   ambassadors={ambassadors}
      //   refresh={() => getAmbassadors()}/>
      // <RotateGuardian
      //   guardians={guardians}
      //   refresh={() => getGuardians()}/>

export default App;
