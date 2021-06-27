import { dashStyleNames2ReactText } from "../autogen-utils.js";

export const renderConfig = (tableName, apiName) => { 
  const reactStyleName = dashStyleNames2ReactText(tableName);
  return {
    name: `RenderConfig${reactStyleName}`,
    deps:[
      {package:"react", top:["React"]},
      {file:"kadena-config.js", funcs:[`${apiName}`, "keyFormatter"]},
      {file:"util.js", funcs:["PactSingleJsonAsTable"]}],
    result: 
  `export const RenderConfig${reactStyleName} = () => {
    return (
      <PactSingleJsonAsTable
        json={${apiName}}
        keyFormatter={keyFormatter}
        />
    )
  };
  `};};