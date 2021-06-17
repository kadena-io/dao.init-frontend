// For util functions

const stringifyHelper = (k,val) => {
  return (
    typeof val === "number" ? val.toFixed() : val
  );
}

const pactStringify = (json) => JSON.stringify(json, (k,v) => renderPactValue(v), 2);

export const renderPactValue = (val) => {
  if (typeof val === 'object' ) {
    if ('time' in val) {
      return val['time'];
    } else if ('timep' in val) {
      return val['timep'];
    } else if ('int' in val) {
      return typeof val['int'] === 'string' ? val['int'] : val['int'].toFixed();
    } else if ('decimal' in val) {
      return typeof val['decimal'] === 'string' ? val['decimal'] : val['decimal'].toFixed();
    } else {
      return JSON.stringify(val, undefined, 2);
    }
  } else if (typeof val === 'boolean') {
    return val.toString();
  } else if (typeof val === 'string') {
    return val;
  } else if (typeof val === 'number'){
    return val.toFixed()
  } else {
    return JSON.stringify(val, undefined, 2);
  }
};
