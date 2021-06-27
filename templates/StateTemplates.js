import { dashStyleNames2ReactText } from "../autogen-utils.js";

export const fetchStateTemplate = (tableName, apiName) => {
  const reactStyleName = dashStyleNames2ReactText(tableName);
  return {
    name: `fetchState${reactStyleName}`,
    deps:[
      {package:"Pact", top:["Pact"]},
      {file:"kadena-config.js", funcs:[`${apiName}`]}],
    result: 
    `export const fetchState${reactStyleName} = async (cmd) => {
      //calling get-all() function from smart contract
        const res = await Pact.fetch.local(
          {
            pactCode: \`(\${forumAPI.contractAddress}.\${cmd})\`,
            //pact-lang-api function to construct transaction meta data
            meta: Pact.lang.mkMeta(
              forumAPI.meta.sender,
              forumAPI.meta.chainId,
              forumAPI.meta.gasPrice,
              forumAPI.meta.gasLimit,
              forumAPI.meta.creationTime(),
              forumAPI.meta.ttl
            ),
          },
          forumAPI.meta.host
        );
        const all = res.result.data;
        //sorts memories by least recent
        console.log(\`local query data: (\${forumAPI.contractAddress}.\${cmd})\`, all);
        return(all);
    };
    `
  };};

export const renderState = (tableName, tableStateGetter) => {
  const reactStyleName = dashStyleNames2ReactText(tableName);
  return {
    name: `RenderState${reactStyleName}`,
    deps:[
      {package:"react", top:["React"]},
      {file:"util.js", funcs:["dashStyleNames2Text","PactSingleJsonAsTable"]}],
    result: 
    `export const RenderState${reactStyleName} = (props) => {
      return (
      <PactSingleJsonAsTable
        json={props.${reactStyleName}}
        keyFormatter={dashStyleNames2Text}
        />
      )
    };`
  };};

