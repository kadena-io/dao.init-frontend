//basic React api imports
import React, { useState, useEffect } from "react";
import {
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { 
  useQueryParams,
  StringParam,
  withDefault
 } from 'use-query-params';
import _ from "lodash";
//semantic ui for styling
import {
  Container,
  Card, CardHeader, CardContent} from '@material-ui/core';
import { NavDrawer } from "./NavDrawer.js";
import { ScrollableTabs } from "./ScrollableTabs.js";

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
import {
  RenderTopics,
  TopicsActionForms,
} from "./Forum/Topics.js";
import {
  RenderTopic,
} from "./Forum/Topic.js";

const App = () => {
  //Top level UI Routing Params
  const [appRoute,setAppRoute] = useQueryParams({
    "app": withDefault(StringParam,"init"),
    "ui": withDefault(StringParam,"guardians")
  });

  //Init Top Level States
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
  const [topics,setTopics] = useState( {} );
  const [comments, setComments] = useState( {} );
   
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

  const getTopics = async () => {
    const res = await getForumContractState("view-topics");
    setTopics(res);
  };

  const getComments = async () => {
    const res = await getForumContractState("view-comments");
    setComments(res);
  };

  const refresh = {
    getForumState: getForumState,
    getMembers: getMembers,
    getTopics: getTopics,
    getComments: getComments,
  };

  useEffect(() => {
    getGuardians();
    getInitState();
    getAmbassadors();
    getForumState();
    getMembers();
    getModLog();
    getTopics();
    getComments();
    console.log('useEffect App.js Fired');
  }, []);

  return (
    <React.Fragment>
          <NavDrawer
            entriesList={[
                [{
                  primary:"dao.init",
                  subList:  
                    [{
                      primary:"Config",
                      to:{app:"init", ui: "config"}
                    },{
                      primary:"Init State",
                      to:{app:"init", ui: "state"}
                    },{
                      primary:"Ambassadors",
                      to:{app:"init", ui: "ambassadors"}
                    },{
                      primary:"Guardians",
                      to:{app:"init", ui: "guardians"}
                    }
                  ]
                },{
                  primary:"dao.forum",
                  subList:  
                    [{
                      primary:"Config",
                      to:{app:"forum", ui: "config"}
                    },{
                      primary:"Forum State",
                      to:{app:"forum", ui: "state"}
                    },{
                      primary:"Mod Log",
                      to:{app:"forum", ui: "modlog"}
                    },{
                      primary:"Mjolnir",
                      to:{app:"forum", ui: "mjolnir"}
                    },{
                      primary:"Moderators",
                      to:{app:"forum", ui: "moderators"}
                    },{
                      primary:"Members",
                      to:{app:"forum", ui: "members"}
                    },{
                      primary:"Topics",
                      to:{app:"forum", ui: "topics"}
                    }
                  ]
                }]
          ]}>
          <Container>
            <Switch>
  { appRoute.app === "init" ?
      ( appRoute.ui === "config" ?
        <Card>
          <CardHeader title="Contract and UI Configuration"/>
          <CardContent>
            <InitConfig/>
          </CardContent>
        </Card>
      : appRoute.ui === "state" ?
        <Card>
          <CardHeader title="Contract State"/>
          <CardContent>
            <RenderInitState initState={initState}/>
          </CardContent>
        </Card>
      : appRoute.ui === "guardians" ?
        <Card>
          <CardHeader title="Guardians"/>
          <CardContent>
            <RenderGuardians guardians={guardians}/>
            <ScrollableTabs
              tabIdx="grdTab"
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
      : appRoute.ui === "ambassadors" ?
        <Card>
          <CardHeader title="Ambassadors"/>
          <CardContent>
            <RenderAmbassadors ambassadors={ambassadors}/>
            <ScrollableTabs
              tabIdx={"ambTab"}
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
      : <Redirect to="/?app=forum&ui=topics">{console.log(`redirecting, got :${appRoute}`)}</Redirect> )
    : appRoute.app === "forum" ? 
      ( appRoute.ui === "config" ? 
        <Card>
          <CardHeader title="Contract and UI Configuration"/>
          <CardContent>
            <ForumConfig/>
          </CardContent>
        </Card>
      : appRoute.ui === "state" ?
      <Card>
        <CardHeader title="Contract State"/>
        <CardContent>
          <RenderForumState forumState={forumState}/>
        </CardContent>
      </Card>
      : appRoute.ui === "mjolnir" ?
      <Card>
        <CardHeader title="Mjolnir Powers"/>
        <CardContent>
          <MjolnirActionForms 
            members={members}
            moderators={moderators}
            pactTxStatus={pactTxStatus}
            refresh={refresh}
          />
        </CardContent>
      </Card>
      : appRoute.ui === "moderators" ?
      <Card>
        <CardHeader title="Moderators"/>
        <CardContent>
          <RenderModerators moderators={moderators}/>
          <ModeratorActionForms
            members={members}
            moderators={moderators}
            guardians={guardians}
            ambassadors={ambassadors}
            pactTxStatus={pactTxStatus}
            refresh={refresh}
          />
        </CardContent>
      </Card>
      : appRoute.ui === "members" ?
      <Card>
        <CardHeader title="Members"/>
        <CardContent>
          <RenderMembers members={members}/>
          <MemberActionForms
            members={members}
            moderators={moderators}
            guardians={guardians}
            ambassadors={ambassadors}
            pactTxStatus={pactTxStatus}
            refresh={refresh}
          />
        </CardContent>
      </Card>
      : appRoute.ui === "modlog" ?
      <Card>
        <CardHeader title="Moderation Log"/>
        <CardContent>
          <RenderModLog modLog={modLog}/>
        </CardContent>
      </Card>
      : appRoute.ui === "topics" ?
      <Card>
        <CardHeader title="Topics"/>
        <CardContent>
          <RenderTopics topics={topics}/>
          <TopicsActionForms
            members={members}
            moderators={moderators}
            topics={topics}
            pactTxStatus={pactTxStatus}
            refresh={refresh}
          />
        </CardContent>
      </Card>
      : appRoute.ui === "topic" ?
      <RenderTopic 
        topics={topics}
      />
      : <Redirect to="/?app=forum&ui=topics">{console.log(`redirecting, got :${appRoute}`,appRoute)}</Redirect> )
    : <Redirect to="/?app=forum&ui=topics">{console.log(`redirecting, got :${appRoute}`,appRoute)}</Redirect> 
  }
            </Switch>
          </Container>
          </NavDrawer>
  </React.Fragment>
  );
};

export default App;
