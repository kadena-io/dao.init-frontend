/*

BLOCKCHAIN CONFIGURATION FILE

  initalize all data for pact-lang-api kadena blockchain calls

  modify this file to interact with different
    chains, networks, contracts

  documentation:
    https://pact-language.readthedocs.io/en/stable/

  pact tutorials:
    https://pactlang.org/

*/

//chain that contract lives on
const chainId = "0";

//id of network version
const networkId = "testnet04";

//network node
const node = "api.testnet.chainweb.com";

//unique contract name
const forumContractName = "forum";
const forumConstants = {}

//unique contract name
const daoContractName = "init";
const daoConstants = {
  "DAO_ACCT_NAME":"dao.init",
  "GUARDIAN_KDA_REQUIRED": 500000};

//unique gas station contract name
const gasStationName = "memory-wall-gas-station";

//namespace that precedes contract name
const namespace = "dao";

//api host to send requests
const host = `https://${node}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;

//creation time for request
const creationTime = () => Math.round(new Date().getTime() / 1000) - 15;

//JSON with all necessary blockchain call data
const daoAPI = {
  contractName: daoContractName,
  gasStationName: gasStationName,
  namespace: namespace,
  contractAddress: `${namespace}.${daoContractName}`,
  gasStationAddress: `${namespace}.${gasStationName}`,
  explorerURL: `https://explorer.chainweb.com/${networkId.slice(0, -2)}`,
  constants: daoConstants,
  meta: {
    networkId: networkId,
    chainId: chainId,
    host: host,
    creationTime: creationTime,
    //gas price at lowest possible denomination
    gasPrice: 0.00000000001,
    //high gas limit for tx
    gasLimit: 10000,
    //time a tx lives in mempool since creationTime
    ttl: 28800,
    //sender === gas payer of the transaction
    //  set to our gas station account defined in memory-wall-gas-station.pact
    sender: "mw-free-gas",
    //nonce here doesnt matter since the tx will never have the same hash
    nonce: "some nonce that doesnt matter",
  },
};

//JSON with all necessary blockchain call data
const forumAPI = {
  contractName: forumContractName,
  gasStationName: gasStationName,
  namespace: namespace,
  contractAddress: `${namespace}.${forumContractName}`,
  gasStationAddress: `${namespace}.${gasStationName}`,
  explorerURL: `https://explorer.chainweb.com/${networkId.slice(0, -2)}`,
  constants: forumConstants,
  meta: {
    networkId: networkId,
    chainId: chainId,
    host: host,
    creationTime: creationTime,
    //gas price at lowest possible denomination
    gasPrice: 0.00000000001,
    //high gas limit for tx
    gasLimit: 10000,
    //time a tx lives in mempool since creationTime
    ttl: 28800,
    //sender === gas payer of the transaction
    //  set to our gas station account defined in memory-wall-gas-station.pact
    sender: "mw-free-gas",
    //nonce here doesnt matter since the tx will never have the same hash
    nonce: "some nonce that doesnt matter",
  },
};

const keyFormatter = (str) =>
  str.replace(new RegExp("[A-Z]+","gm")," $&").replace(new RegExp("^[a-z]","gm"),k => k.toUpperCase());

module.exports = { daoAPI: daoAPI, forumAPI: forumAPI, keyFormatter: keyFormatter }
