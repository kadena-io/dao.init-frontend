// For util functions

export const renderPactValue = (val) => {
  if (typeof val === 'object' ) {
    if ('time' in val) {
      return val['time'];
    } else if ('timep' in val) {
      return val['timep'].split('.')[0] + "Z";
    } else if ('int' in val) {
      return val['int'];
    } else if ('decimal' in val) {
      return val['decimal'];
    } else {
      return JSON.stringify(val);
    }
  } else if (typeof val === 'boolean') {
    return JSON.stringify(val);
  } else {
    return val;
  }
};
