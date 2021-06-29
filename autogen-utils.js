
export const dashStyleNames2Text = str => str.split("-").map(k=>k.replace(new RegExp("^.","gm"),a=>a.toUpperCase())).join(' ');
export const dashStyleNames2ReactText = str => dashStyleNames2Text(str).replace(/\s/g, '');
export const dashStyleNames2ReactVar = str => dashStyleNames2ReactText(str).replace(new RegExp("^."),a=>a.toLowerCase());