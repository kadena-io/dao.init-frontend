//basic React api imports
import React, { useState, useEffect } from "react";
import {
  Switch,
} from 'react-router-dom';
import { 
  useQueryParams,
  StringParam,
  withDefault
 } from 'use-query-params';
import createPersistedState from 'use-persisted-state';
import _ from 'lodash';
//semantic ui for styling
import {
  Container,
  Card, CardHeader, CardContent} from '@material-ui/core';
import { NavDrawer } from "./NavDrawer.js";

import { 
  walletDrawerEntries,
  WalletApp,
 } from "./Wallet.js";

import {
  initDrawerEntries,
  InitApp
} from "./Init/Init.js";
import { getContractState } from "./Init/InitState.js";

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
  RenderComments,
  CommentsActionForms,
} from "./Forum/Comments.js";
import {
  RenderTopic,
} from "./Forum/Topic.js";

const App = () => {
  //Top level UI Routing Params
  const [appRoute,setAppRoute] = useQueryParams({
    "app": withDefault(StringParam,"forum"),
    "ui": withDefault(StringParam,"topics")
  });

  //Init Top Level States
  const [initState, setInitState] = createPersistedState("initState")({});
  const [guardians, setGuardians] = createPersistedState("guardians")([]);
  const [ambassadors, setAmbassadors] = createPersistedState("ambassadors")([]);
  
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
  const [tx, setTx] = useState({});
  const [txRes, setTxRes] = useState({});
  const pactTxStatus = {
    tx:tx,setTx:setTx,
    txStatus:txStatus,setTxStatus:setTxStatus,
    txRes:txRes,setTxRes:setTxRes,
  };

  //Forum Top Level States
  const [forumState, setForumState] = createPersistedState("forumState")({});
  const [members, setMembers] = createPersistedState("members")([]);
  const [moderators, setModerators] = createPersistedState("moderators")([]);
  const [modLog, setModLog] = createPersistedState("modLog")([]);
  const [topics,setTopics] = createPersistedState("topics")([]);
  const [comments, setComments] = createPersistedState("comments")([]);
   
  const getForumState = async () => {
    const res = await getForumContractState("view-state");
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
    getInitState: getInitState,
    getGuardians: getGuardians,
    getAmbassadors: getAmbassadors,
    getForumState: getForumState,
    getMembers: getMembers,
    getTopics: getTopics,
    getComments: getComments,
    getModLog: getModLog,
  };

  const refreshAll = async () => _.forIn(refresh,(k,v) => v());

  useEffect(() => {
    getGuardians();
    getInitState();
    getAmbassadors();
    getForumState();
    getMembers();
    getModLog();
    getTopics();
    getComments();
    console.debug('App.useEffect[] fired');
  }, []);

  return (
          <NavDrawer
            entriesList={[
                [ walletDrawerEntries
                , initDrawerEntries
                ,{
                  primary:"dao.forum",
                  subList:  
                    [{
                      primary:"Admin",
                      subList:[{
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
                      }]
                    },{
                      primary:"Members",
                      to:{app:"forum", ui: "members"}
                    },{
                      primary:"Topics",
                      to:{app:"forum", ui: "topics"}
                    },{
                      primary:"Comments",
                      to:{app:"forum", ui: "comments"}
                    }
                  ]
                }]
          ]}>
          <Container>
            <Switch>
  { appRoute.app === "wallet" ?
    <WalletApp
      appRoute={appRoute}
      setAppRoute={setAppRoute}
    />
    : appRoute.app === "init" ?
    <InitApp 
      appRoute={appRoute}
      setAppRoute={setAppRoute}
      initState={initState}
      guardians={guardians}
      ambassadors={ambassadors}
      pactTxStatus={pactTxStatus}
      refresh={refresh}
      />
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
            tabIdx="mjolnirTab"
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
            tabIdx="modTab"
            members={members}
            moderators={moderators}
            topics={topics}
            comments={comments}
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
            tabIdx="memTab"
            members={members}
            moderators={moderators}
            topics={topics}
            comments={comments}
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
          <RenderTopics 
            topics={topics}
            moderators={moderators}
            pactTxStatus={pactTxStatus}
            refresh={refresh}
            />
          <TopicsActionForms
            tabIdx="topicsTab"
            members={members}
            moderators={moderators}
            topics={topics}
            pactTxStatus={pactTxStatus}
            refresh={refresh}
          />
        </CardContent>
      </Card>
      : appRoute.ui === "comments" ?
      <Card>
        <CardHeader title="Comments"/>
        <CardContent>
          <RenderComments comments={comments}/>
          <CommentsActionForms
            topics={topics}
            comments={comments}
            tabIdx="commentsTab"
            members={members}
            moderators={moderators}
            pactTxStatus={pactTxStatus}
            refresh={refresh}
          />
        </CardContent>
      </Card>
      : appRoute.ui === "topic" ?
      <RenderTopic 
        topics={topics}
        comments={comments}
        members={members}
        moderators={moderators}
        pactTxStatus={pactTxStatus}
        refresh={refresh}
      />
      : <React.Fragment>
        {() => {
          console.log("Redirecting, this didn't match:", appRoute);
          setAppRoute({app:"wallet",ui:"config"})}
        }
      </React.Fragment> )
    : <React.Fragment>
        {() => {
          console.log("Redirecting, this didn't match:", appRoute);
          setAppRoute({app:"wallet",ui:"config"})}
        }
      </React.Fragment>
    }
            </Switch>
          </Container>
          </NavDrawer>
  );
};

export default App;
