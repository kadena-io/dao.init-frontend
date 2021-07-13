//basic React api imports
import React, {  } from "react";
//semantic ui for styling
import {
  Card, CardHeader, CardContent} from '@material-ui/core';
import { ScrollableTabs } from "../ScrollableTabs.js";

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
import { RenderInitState } from "./InitState.js";

export const initDrawerEntries = {
  primary:"dao.init",
  subList:
    [{
      primary:"Config & State",
      subList:[{
        primary:"Config",
        to:{app:"init", ui: "config"}
      },{
        primary:"Init State",
        to:{app:"init", ui: "state"}
      }]
    },{
      primary:"Ambassadors",
      to:{app:"init", ui: "ambassadors"}
    },{
      primary:"Guardians",
      to:{app:"init", ui: "guardians"}
    }
  ]
};

export const InitApp = ({
  appRoute, 
  setAppRoute,
  initState, 
  guardians, 
  ambassadors,
  pactTxStatus,
  refresh}) => {

  const {getAmbassadors, getGuardians} = refresh;
  return (
    appRoute.ui === "config" ?
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
  : <React.Fragment>
      {setAppRoute({app:"wallet", ui:"config"})}
  </React.Fragment>
  )
};