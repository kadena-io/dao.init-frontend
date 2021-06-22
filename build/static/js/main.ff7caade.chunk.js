(this["webpackJsonpdao.init-frontend"]=this["webpackJsonpdao.init-frontend"]||[]).push([[0],{104:function(e,t,a){e.exports=a(126)},118:function(e,t){},126:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(13),c=a.n(o),s=a(18),l=a.n(s),i=a(31),u=a(8),m=a(15),d=a(91),p=a(187),f=a(188),b=a(183),x=a(170),g=a(189),E=a(190),h=a(191),S=a(169),v=a(129),y=a(22),k=a.n(y),A=a(7),O=a(161),j=a(171),T=a(172),C=a(173),w=a(174),R=a(175),N=a(176),F=a(95),I=a(192),P=a(178),D=a(179),G=a(180),L=a(196),z=a(166),U=a(87),M=a.n(U),B=a(167),W=a(168),J=a(193),_=a(195),q=a(163),V=a(165),K=Object(O.a)((function(e){return{root:{width:"100%","& > * + *":{marginTop:e.spacing(2)}}}})),H=function(e){var t=e.tx,a=e.txRes,o=e.txStatus,c=Object(n.useState)(!0),s=Object(u.a)(c,2),l=s[0],i=s[1],m=Object(n.useState)(!1),d=Object(u.a)(m,2),p=d[0],f=d[1],b=K(),g="pending"===o?"info":"success"===o?"success":"timeout"===o?"warning":"error";return Object(n.useEffect)((function(){return i(!0)}),[o]),o?r.a.createElement("div",{className:b.root},r.a.createElement(q.a,{in:l},r.a.createElement(L.a,{severity:g,action:r.a.createElement(V.a,{"aria-label":"close",color:"inherit",size:"small",onClick:function(){return i(!1)}},r.a.createElement(M.a,{fontSize:"inherit"}))},r.a.createElement(z.a,null,r.a.createElement(B.a,{container:!0,direction:"row",justify:"flex-start",alignItems:"center"},r.a.createElement(B.a,{item:!0},Q(o)),"validation-error"===o||"failure"===o?r.a.createElement(B.a,{item:!0},r.a.createElement(W.a,{orientation:"vertical",flexItem:!0}),r.a.createElement(S.a,{size:"small",onClick:function(){return f(!0)}},"View")):r.a.createElement(r.a.Fragment,null))),"pending"===o?r.a.createElement(r.a.Fragment,null,r.a.createElement("p",null,"Awaiting Confirmation"),r.a.createElement("a",{href:"".concat(A.kadenaAPI.explorerURL,"/tx/").concat(t.hash)},"Eventual Block Explorer Link")):"success"===o?r.a.createElement(r.a.Fragment,null,r.a.createElement("a",{href:"".concat(A.kadenaAPI.explorerURL,"/tx/").concat(t.hash)},"View transaction in Block Explorer")):"failure"===o?r.a.createElement(r.a.Fragment,null,r.a.createElement("a",{href:"".concat(A.kadenaAPI.explorerURL,"/tx/").concat(t.hash)},"View transaction in Block Explorer"),r.a.createElement("div",null,r.a.createElement(_.a,{open:p,onClose:function(){return f(!1)}},r.a.createElement(x.a,{maxWidth:"lg"},r.a.createElement(ee,{json:a}))))):"timeout"===o?r.a.createElement(r.a.Fragment,null,r.a.createElement("p",null,"...but your tx was sent."),r.a.createElement("a",{href:"".concat(A.kadenaAPI.explorerURL,"/tx/").concat(t.hash)},"View transaction in Block Explorer")):"validation-error"===o?r.a.createElement(r.a.Fragment,null,r.a.createElement(J.a,null,"Transaction was not sent to Blockchain. Check your keys or metadata."),r.a.createElement("div",null,r.a.createElement(_.a,{open:p,onClose:function(){return f(!1)}},r.a.createElement(x.a,{maxWidth:"md"},r.a.createElement(F.a,null,a.toString()))))):r.a.createElement(r.a.Fragment,null)))):r.a.createElement(r.a.Fragment,null)},Q=(Object(O.a)((function(e){return{root:{display:"flex",flexWrap:"wrap","& .MuiTextField-root":{margin:e.spacing(1),width:"25ch"}},margin:{margin:e.spacing(1)},withoutLabel:{marginTop:e.spacing(3)},textField:{width:"25ch"}}})),function(e){return e.split("-").map((function(e){return e.replace(new RegExp("^.","gm"),(function(e){return e.toUpperCase()}))})).join(" ")}),$=function(e){return!e||"object"!==typeof e||("timep"in e||"int"in e||"decimal"in e||"time"in e)},Z=function(e){return e&&"object"===typeof e?"time"in e?e.time:"timep"in e?e.timep:"int"in e?"string"===typeof e.int?e.int:e.int.toLocaleString():"decimal"in e?"string"===typeof e.decimal?e.decimal:e.decimal.toLocaleString():JSON.stringify(e):"boolean"===typeof e?e.toString():"string"===typeof e?e:"number"===typeof e?e.toLocaleString():JSON.stringify(e)},X=Object(O.a)({table:{minWidth:650}}),Y=Object(O.a)({table:{minWidth:650},root:{"& > *":{borderBottom:"unset"}}}),ee=function e(t){var a=t.json||{},n=t.isNested||!1,o=n?Y:X,c=t.header||[],s=t.keyFormatter?t.keyFormatter:function(e){return e},l=t.valFormatter?t.valFormatter:function(e){return r.a.createElement("code",null,Z(e))},i=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(j.a,null,r.a.createElement(T.a,null,c.map((function(e){return r.a.createElement(C.a,null,e)})))),r.a.createElement(w.a,null,Object.entries(a).map((function(t){var n=Object(u.a)(t,2),o=n[0],c=n[1];return r.a.createElement(T.a,{key:o},!1===Array.isArray(a)?r.a.createElement(C.a,null,s(o)):r.a.createElement(r.a.Fragment,null),$(c)?r.a.createElement(C.a,null,l(c)):"object"===typeof c?r.a.createElement(e,{json:c,keyFormatter:s,valFormatter:l,isNested:!0}):"function"===typeof c?r.a.createElement(C.a,null,l(c.toString())):r.a.createElement(C.a,null,l(c)))}))))};return n?r.a.createElement(R.a,{className:o.table,size:"small","aria-label":"simple table"},i()):r.a.createElement(N.a,{component:F.a},r.a.createElement(R.a,{className:o.table,size:"small","aria-label":"simple table"},i()))},te=function e(t){var a=t.json||{},n=t.isNested||!1,o=n?Y:X,c=t.header||[],s=[];t.keyOrder?s=t.keyOrder:Array.isArray(t.json)&&a.length>0&&(s=Object.keys(a[0]));var l=t.keyFormatter?t.keyFormatter:function(e){return e},i=t.valFormatter?t.valFormatter:function(e){return r.a.createElement("code",null,Z(e))},u=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(j.a,null,r.a.createElement(T.a,null,c.map((function(e){return r.a.createElement(C.a,null,e)})))),r.a.createElement(w.a,null,a.map((function(t){return r.a.createElement(T.a,{key:t[s[0]]},s.map((function(a){var n=t[a];return r.a.createElement(C.a,null,$(n)?i(n):Array.isArray(n)?r.a.createElement(e,{json:n,keyFormatter:l,valFormatter:i,isNested:!0}):"object"===typeof n?r.a.createElement(ee,{json:n,keyFormatter:l,valFormatter:i,isNested:!0}):i("function"===typeof n?n.toString():n))})))}))))};return n?r.a.createElement(R.a,{className:o.table,size:"small","aria-label":"simple table"},u()):r.a.createElement(N.a,{component:F.a},r.a.createElement(R.a,{className:o.table,size:"small","aria-label":"simple table"},u()))},ae=function(e){var t=e.inputField,a=t.type,n=t.label,o=t.options,c=t.placeholder,s=t.className,l=t.onChange,i=t.value;return"select"===a?r.a.createElement(I.a,{id:"outlined-multiline-static",select:!0,required:!0,fullWidth:!0,className:s,variant:"outlined",label:n,onChange:function(e){return l(e.target.value)}},o.map((function(e){return r.a.createElement(P.a,{key:e,value:e},e)}))):"textFieldSingle"===a?r.a.createElement(I.a,{required:!0,fullWidth:!0,value:i,className:s,variant:"outlined",label:n,onChange:function(e){return l(e.target.value)}}):"textFieldMulti"===a?r.a.createElement(I.a,{required:!0,fullWidth:!0,label:n,className:s,multiline:!0,rows:4,variant:"outlined",placeholder:c,onChange:function(e){return l(e.target.value)}}):null},ne=function(e){var t=e.inputFields,a=e.onSubmit,o=e.tx,c=e.txRes,s=e.txStatus,l=e.setTxStatus,i=Object(n.useState)(!1),m=Object(u.a)(i,2),d=m[0],p=m[1];return Object(n.useEffect)((function(){return p(!1)}),[t]),Object(n.useEffect)((function(){return p(""!==s||d)}),[s]),r.a.createElement("div",null,r.a.createElement("form",{autoComplete:"off",onSubmit:function(e){return a(e)}},t.map((function(e){return r.a.createElement(ae,{inputField:e})})),r.a.createElement(D.a,null,"pending"===s?null:r.a.createElement(S.a,{variant:"outlined",color:"default",type:"submit",disabled:d},"Submit"))),"pending"===s?r.a.createElement(G.a,null):null,r.a.createElement(H,{tx:o,txRes:c,txStatus:s,setTxStatus:l}))},re=Object(v.a)((function(){return{formControl:{margin:"5px auto",minWidth:120},selectEmpty:{marginTop:"10px auto"}}})),oe=function(){var e=Object(i.a)(l.a.mark((function e(t,a,n,r,o,c){var s,i,u,m,d,p,f,b=arguments;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return s=b.length>6&&void 0!==b[6]?b[6]:{},i=b.length>7&&void 0!==b[7]?b[7]:[],e.prev=2,u={pactCode:c,caps:Array.isArray(i)&&i.length?i:k.a.lang.mkCap("Guadian Cap","Authenticates that you're a guardian","".concat(A.kadenaAPI.contractAddress,".GUARDIAN"),[o]),gasLimit:A.kadenaAPI.meta.gasLimit,chainId:A.kadenaAPI.meta.chainId,ttl:A.kadenaAPI.meta.ttl,sender:o,envData:s},console.log("toSign",u),e.next=7,k.a.wallet.sign(u);case 7:return m=e.sent,console.log("signed",m),t(m),e.next=12,k.a.wallet.sendSigned(m,A.kadenaAPI.meta.host);case 12:d=e.sent,console.log("txReqKeys",d),a("pending"),e.prev=15,p=8,f={};case 18:if(!(p>0)){e.next=27;break}return e.next=21,new Promise((function(e){return setTimeout(e,15e3)}));case 21:return e.next=23,k.a.fetch.poll(d,A.kadenaAPI.meta.host);case 23:f=e.sent;try{f[m.hash].result.status?p=-1:p-=1}catch(l){p-=1}e.next=18;break;case 27:n(f),"success"===f[m.hash].result.status?(console.log("tx status set to success"),a("success"),r()):0===p?(console.log("tx status set to timeout"),a("timeout"),r()):(console.log("tx status set to failure"),a("failure")),e.next=37;break;case 32:e.prev=32,e.t0=e.catch(15),console.log("tx api failure",e.t0),n(e.t0),a("failure");case 37:e.next=43;break;case 39:e.prev=39,e.t1=e.catch(2),console.log("tx status set to validation error",e.t1),a("validation-error");case 43:case"end":return e.stop()}}),e,null,[[2,39],[15,32]])})));return function(t,a,n,r,o,c){return e.apply(this,arguments)}}(),ce=function(e){return r.a.createElement(te,{header:["Guardian","Committed KDA","Approved Hash","Approval Date","Guard"],keyOrder:["k","committed-kda","approved-hash","approved-date","guard"],json:e.guardians})},se=function(e){var t=e.refresh,a=e.guardians,o=Object(n.useState)(""),c=Object(u.a)(o,2),s=c[0],l=c[1],i=Object(n.useState)(""),m=Object(u.a)(i,2),d=m[0],p=m[1],f=Object(n.useState)(""),b=Object(u.a)(f,2),x=b[0],g=b[1],E=e.pactTxStatus,h=E.txStatus,S=E.setTxStatus,v=E.tx,y=E.setTx,k=E.txRes,O=E.setTxRes,j=re(),T=[{type:"select",label:"Select Guardian",className:j.formControl,onChange:l,options:a.map((function(e){return e.k}))},{type:"textFieldSingle",label:"Ambassador Account Name",className:j.formControl,value:d,onChange:p},{type:"textFieldMulti",label:"Ambassador Account Guard",className:j.formControl,placeholder:JSON.stringify({pred:"keys-all",keys:["8c59a322800b3650f9fc5b6742aa845bc1c35c2625dabfe5a9e9a4cada32c543"]},void 0,2),value:x,onChange:g}];return r.a.createElement(ne,{inputFields:T,onSubmit:function(e){e.preventDefault();try{oe(y,S,O,t,s,"(".concat(A.kadenaAPI.contractAddress,'.register-ambassador "').concat(s,'" "').concat(d,"\" (read-keyset 'ks))"),{ks:JSON.parse(x)})}catch(a){console.log("Ambassador Registration Submit Error",typeof a,a,s,d,x),O(a),S("validation-error")}},tx:v,txStatus:h,txRes:k,setTxStatus:S})},le=function(e){var t=e.refresh,a=Object(n.useState)(""),o=Object(u.a)(a,2),c=o[0],s=o[1],l=Object(n.useState)(""),i=Object(u.a)(l,2),m=i[0],d=i[1],p=e.pactTxStatus,f=p.txStatus,b=p.setTxStatus,x=p.tx,g=p.setTx,E=p.txRes,h=p.setTxRes,S=re(),v=[{type:"select",label:"Select Guardian",className:S.formControl,onChange:s,options:e.guardians.map((function(e){return e.k}))},{type:"select",label:"Select Ambassador",className:S.formControl,onChange:d,options:e.ambassadors.map((function(e){return e.k}))}];return r.a.createElement(ne,{inputFields:v,onSubmit:function(e){e.preventDefault();try{oe(g,b,h,t,c,"(".concat(A.kadenaAPI.contractAddress,'.deactivate-ambassador "').concat(c,'" "').concat(m,'")'))}catch(a){console.log("deactivate-ambassador Submit Error",typeof a,a,c),h(a),b("validation-error")}},tx:x,txStatus:f,txRes:E,setTxStatus:b})},ie=function(e){var t=e.refresh,a=Object(n.useState)(""),o=Object(u.a)(a,2),c=o[0],s=o[1],l=Object(n.useState)(""),i=Object(u.a)(l,2),m=i[0],d=i[1],p=e.pactTxStatus,f=p.txStatus,b=p.setTxStatus,x=p.tx,g=p.setTx,E=p.txRes,h=p.setTxRes,S=re(),v=[{type:"select",label:"Select Guardian",className:S.formControl,onChange:s,options:e.guardians.map((function(e){return e.k}))},{type:"select",label:"Select Ambassador",className:S.formControl,onChange:d,options:e.ambassadors.map((function(e){return e.k}))}];return r.a.createElement(ne,{inputFields:v,onSubmit:function(e){e.preventDefault();try{oe(g,b,h,t,c,"(".concat(A.kadenaAPI.contractAddress,'.reactivate-ambassador "').concat(c,'" "').concat(m,'")'))}catch(a){console.log("reactivate-ambassador Submit Error",typeof a,a,c),h(a),b("validation-error")}},tx:x,txStatus:f,txRes:E,setTxStatus:b})},ue=function(e){var t=e.refresh,a=e.guardians,o=Object(n.useState)(""),c=Object(u.a)(o,2),s=c[0],l=c[1],i=Object(n.useState)(""),m=Object(u.a)(i,2),d=m[0],p=m[1],f=e.pactTxStatus,b=f.txStatus,x=f.setTxStatus,g=f.tx,E=f.setTx,h=f.txRes,S=f.setTxRes,v=re(),y=[{type:"select",label:"Select Guardian",className:v.formControl,onChange:l,options:a.map((function(e){return e.k}))},{type:"textFieldMulti",label:"Guardian Account Guard",className:v.formControl,placeholder:JSON.stringify({pred:"keys-all",keys:["8c59a322800b3650f9fc5b6742aa845bc1c35c2625dabfe5a9e9a4cada32c543"]},void 0,2),value:d,onChange:p}];return r.a.createElement(ne,{inputFields:y,onSubmit:function(e){e.preventDefault();try{oe(E,x,S,t,s,"(".concat(A.kadenaAPI.contractAddress,'.rotate-guardian "').concat(s,"\" (read-keyset 'ks))"),{ks:JSON.parse(d)})}catch(a){console.log("rotate-guardian Submit Error",typeof a,a,s),S(a),x("validation-error")}},tx:g,txStatus:b,txRes:h,setTxStatus:x})},me=function(e){var t=e.refresh,a=e.guardians,o=Object(n.useState)(""),c=Object(u.a)(o,2),s=c[0],l=c[1],i=Object(n.useState)(""),m=Object(u.a)(i,2),d=m[0],p=m[1],f=e.pactTxStatus,b=f.txStatus,x=f.setTxStatus,g=f.tx,E=f.setTx,h=f.txRes,S=f.setTxRes,v=re(),y=[{type:"select",label:"Select Guardian",className:v.formControl,onChange:l,options:a.map((function(e){return e.k}))},{type:"textFieldSingle",label:"Proposed Upgrade Hash",className:v.formControl,value:d,onChange:p}];return r.a.createElement(ne,{inputFields:y,onSubmit:function(e){e.preventDefault();try{oe(E,x,S,t,s,"(".concat(A.kadenaAPI.contractAddress,'.propose-dao-upgrade "').concat(s,'" "').concat(d,'")'))}catch(a){console.log("propose-dao-upgrade Submit Error",typeof a,a,s,d),S(a),x("validation-error")}},tx:g,txStatus:b,txRes:h,setTxStatus:x})},de=function(e){var t=e.refresh,a=e.guardians,o=Object(n.useState)(""),c=Object(u.a)(o,2),s=c[0],l=c[1],i=Object(n.useState)(""),m=Object(u.a)(i,2),d=m[0],p=m[1],f=e.pactTxStatus,b=f.txStatus,x=f.setTxStatus,g=f.tx,E=f.setTx,h=f.txRes,S=f.setTxRes,v=re(),y=[{type:"select",label:"Select Guardian",className:v.formControl,onChange:l,options:a.map((function(e){return e.k}))},{type:"select",label:"Proposed Upgrade Hash",className:v.formControl,value:p,options:a.map((function(e){return e["approved-hash"]}))}];return r.a.createElement(ne,{inputFields:y,onSubmit:function(e){e.preventDefault();try{oe(E,x,S,t,s,"(".concat(A.kadenaAPI.contractAddress,'.guardian-approve-hash "').concat(s,'" "').concat(d,'")'))}catch(a){console.log("guardian-approve-hash Submit Error",typeof a,a,s,d),S(a),x("validation-error")}},tx:g,txStatus:b,txRes:h,setTxStatus:x})},pe=function(e){var t=e.refresh,a=Object(n.useState)(""),o=Object(u.a)(a,2),c=o[0],s=o[1],l=Object(n.useState)(""),i=Object(u.a)(l,2),m=i[0],d=i[1],p=e.pactTxStatus,f=p.txStatus,b=p.setTxStatus,x=p.tx,g=p.setTx,E=p.txRes,h=p.setTxRes,S=re(),v=[{type:"textFieldSingle",label:"Guardian Account Name",className:S.formControl,value:c,onChange:s},{type:"textFieldMulti",label:"Guardian Account Guard",className:S.formControl,placeholder:JSON.stringify({pred:"keys-all",keys:["8c59a322800b3650f9fc5b6742aa845bc1c35c2625dabfe5a9e9a4cada32c543"]},void 0,2),value:m,onChange:d}];return r.a.createElement(ne,{inputFields:v,onSubmit:function(e){e.preventDefault();try{oe(g,b,h,t,c,"(".concat(A.kadenaAPI.contractAddress,'.register-guardian "').concat(c,"\" (read-keyset 'ks))"),{ks:JSON.parse(m)},[k.a.lang.mkCap("TRANSFER Cap","Stake the needed amount","coin.TRANSFER",[c,A.kadenaAPI.constants.DAO_ACCT_NAME,A.kadenaAPI.constants.GUARDIAN_KDA_REQUIRED])])}catch(a){console.log("Guardian Registration Submit Error",typeof a,a,c,m),h(a),b("validation-error")}},tx:x,txStatus:f,txRes:E,setTxStatus:b})},fe=Object(v.a)((function(){return{formControl:{margin:"5px auto",minWidth:120},selectEmpty:{marginTop:"10px auto"}}})),be=function(e){return r.a.createElement(te,{header:["Ambassador","Active","Voted to Freeze","Guard"],keyOrder:["k","active","voted-to-freeze","guard"],json:e.ambassadors})},xe=function(){var e=Object(i.a)(l.a.mark((function e(t,a,n,r,o,c){var s,i,u,m,d,p,f,b=arguments;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return s=b.length>6&&void 0!==b[6]?b[6]:{},i=b.length>7&&void 0!==b[7]?b[7]:[],e.prev=2,u={pactCode:c,caps:Array.isArray(i)&&i.length?i:k.a.lang.mkCap("Ambassador Cap","Authenticates that you're an ambassador","".concat(A.kadenaAPI.contractAddress,".AMBASSADOR"),[o]),gasLimit:A.kadenaAPI.meta.gasLimit,chainId:A.kadenaAPI.meta.chainId,ttl:A.kadenaAPI.meta.ttl,sender:o,envData:s},console.log("toSign",u),e.next=7,k.a.wallet.sign(u);case 7:return m=e.sent,console.log("signed",m),t(m),e.next=12,k.a.wallet.sendSigned(m,A.kadenaAPI.meta.host);case 12:d=e.sent,console.log("txReqKeys",d),a("pending"),e.prev=15,p=8,f={};case 18:if(!(p>0)){e.next=27;break}return e.next=21,new Promise((function(e){return setTimeout(e,15e3)}));case 21:return e.next=23,k.a.fetch.poll(d,A.kadenaAPI.meta.host);case 23:f=e.sent;try{f[m.hash].result.status?p=-1:p-=1}catch(l){p-=1}e.next=18;break;case 27:n(f),"success"===f[m.hash].result.status?(console.log("tx status set to success"),a("success"),r()):0===p?(console.log("tx status set to timeout"),a("timeout"),r()):(console.log("tx status set to failure"),a("failure")),e.next=37;break;case 32:e.prev=32,e.t0=e.catch(15),console.log("tx api failure",e.t0),n(e.t0),a("failure");case 37:e.next=43;break;case 39:e.prev=39,e.t1=e.catch(2),console.log("tx status set to validation error",e.t1),a("validation-error");case 43:case"end":return e.stop()}}),e,null,[[2,39],[15,32]])})));return function(t,a,n,r,o,c){return e.apply(this,arguments)}}(),ge=function(e){var t=e.refresh,a=e.ambassadors,o=Object(n.useState)(""),c=Object(u.a)(o,2),s=c[0],l=c[1],i=e.pactTxStatus,m=i.txStatus,d=i.setTxStatus,p=i.tx,f=i.setTx,b=i.txRes,x=i.setTxRes,g=[{type:"select",label:"Select Ambassador",className:fe().formControl,onChange:l,options:a.map((function(e){return e.k}))}];return r.a.createElement(ne,{inputFields:g,onSubmit:function(e){e.preventDefault();try{xe(f,d,x,t,s,"(".concat(A.kadenaAPI.contractAddress,'.vote-to-freeze "').concat(s,'")'))}catch(a){console.log("vote to freeze Submit Error",typeof a,a,s),x(a),d("validation-error")}},tx:p,txStatus:m,txRes:b,setTxStatus:d})},Ee=function(e){var t=e.refresh,a=e.ambassadors,o=Object(n.useState)(""),c=Object(u.a)(o,2),s=c[0],l=c[1],i=e.pactTxStatus,m=i.txStatus,d=i.setTxStatus,p=i.tx,f=i.setTx,b=i.txRes,x=i.setTxRes,g=[{type:"select",label:"Select Ambassador",className:fe().formControl,onChange:l,options:a.map((function(e){return e.k}))}];return r.a.createElement(ne,{inputFields:g,onSubmit:function(e){e.preventDefault();try{xe(f,d,x,t,s,"(".concat(A.kadenaAPI.contractAddress,'.freeze "').concat(s,'")'))}catch(a){console.log("freeze Submit Error",typeof a,a,s),x(a),d("validation-error")}},tx:p,txStatus:m,txRes:b,setTxStatus:d})},he=function(e){var t=e.refresh,a=e.ambassadors,o=Object(n.useState)(""),c=Object(u.a)(o,2),s=c[0],l=c[1],i=Object(n.useState)(""),m=Object(u.a)(i,2),d=m[0],p=m[1],f=e.pactTxStatus,b=f.txStatus,x=f.setTxStatus,g=f.tx,E=f.setTx,h=f.txRes,S=f.setTxRes,v=fe(),y=[{type:"select",label:"Select Ambassador",className:v.formControl,onChange:l,options:a.map((function(e){return e.k}))},{type:"textFieldMulti",label:"Guardian Account Guard",className:v.formControl,placeholder:JSON.stringify({pred:"keys-all",keys:["8c59a322800b3650f9fc5b6742aa845bc1c35c2625dabfe5a9e9a4cada32c543"]},void 0,2),value:d,onChange:p}];return r.a.createElement(ne,{inputFields:y,onSubmit:function(e){e.preventDefault();try{xe(E,x,S,t,s,"(".concat(A.kadenaAPI.contractAddress,'.rotate-ambassador "').concat(s,"\" (read-keyset 'ks))"),{ks:JSON.parse(d)})}catch(a){console.log("rotate-ambassador Submit Error",typeof a,a,s,d),S(a),x("validation-error")}},tx:g,txStatus:b,txRes:h,setTxStatus:x})},Se=function(){return r.a.createElement(ee,{json:A.kadenaAPI,keyFormatter:A.keyFormatter})},ve=function(){var e=Object(i.a)(l.a.mark((function e(t){var a,n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,k.a.fetch.local({pactCode:"(".concat(A.kadenaAPI.contractAddress,".").concat(t,")"),meta:k.a.lang.mkMeta(A.kadenaAPI.meta.sender,A.kadenaAPI.meta.chainId,A.kadenaAPI.meta.gasPrice,A.kadenaAPI.meta.gasLimit,A.kadenaAPI.meta.creationTime(),A.kadenaAPI.meta.ttl)},A.kadenaAPI.meta.host);case 2:return a=e.sent,n=a.result.data,console.log("local query data",n),e.abrupt("return",n);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),ye=function(e){return r.a.createElement(ee,{json:e.initState,header:["","Status"],keyFormatter:Q})},ke=a(68),Ae=a(72),Oe=a(128),je=a(181),Te=a(182),Ce=a(177),we=a(184),Re=a(185),Ne=a(35),Fe=a(197),Ie=a(198),Pe=a(14),De=a(90),Ge=a.n(De),Le=a(88),ze=a.n(Le),Ue=a(89),Me=a.n(Ue),Be=Object(O.a)((function(e){return{root:{display:"flex"},drawer:Object(ke.a)({},e.breakpoints.up("sm"),{width:240,flexShrink:0}),appBar:Object(ke.a)({},e.breakpoints.up("sm"),{zIndex:e.zIndex.drawer+1}),menuButton:Object(ke.a)({marginRight:e.spacing(2)},e.breakpoints.up("sm"),{display:"none"}),toolbar:e.mixins.toolbar,drawerPaper:{width:240},content:{flexGrow:1,padding:e.spacing(3)}}})),We=function e(t){var a=t.icon,n=t.primary,o=t.to,c=t.subList,s=c&&Array.isArray(c),l=r.a.useState(!1),i=Object(u.a)(l,2),m=i[0],d=i[1],p=r.a.useMemo((function(){return r.a.forwardRef((function(e,t){return r.a.createElement(Ae.a,Object.assign({to:o,ref:t},e))}))}),[o]);return r.a.createElement(r.a.Fragment,null,r.a.createElement("li",null,r.a.createElement(Oe.a,{button:!0,component:p},a?r.a.createElement(je.a,null,a):null,r.a.createElement(Te.a,{primary:n}),s?m?r.a.createElement(ze.a,{onClick:function(){return d(!m)}}):r.a.createElement(Me.a,{onClick:function(){return d(!m)}}):null)),s?r.a.createElement(q.a,{in:m,timeout:"auto",unmountOnExit:!0},r.a.createElement(Ce.a,{component:"div",disablePadding:!0},c.map((function(t){return r.a.createElement(e,{icon:t.icon,primary:t.primary,to:t.to,subList:t.subList})})))):null)},Je=function(e){var t=e.window,a=e.entriesList,n=Be(),o=Object(Pe.a)(),c=r.a.useState(!1),s=Object(u.a)(c,2),l=s[0],i=s[1],m=function(){i(!l)},d=r.a.createElement("div",null,r.a.createElement("div",{className:n.toolbar}),a.map((function(e){return r.a.createElement(r.a.Fragment,null,r.a.createElement(W.a,null),r.a.createElement(Ce.a,null,e.map((function(e){return r.a.createElement(We,{icon:e.icon,primary:e.primary,to:e.to,subList:e.subList})}))))}))),p=void 0!==t?function(){return t().document.body}:void 0;return r.a.createElement("div",{className:n.root},r.a.createElement(b.a,null),r.a.createElement(we.a,{position:"fixed",className:n.appBar},r.a.createElement(Re.a,null,r.a.createElement(V.a,{color:"inherit","aria-label":"open drawer",edge:"start",onClick:m,className:n.menuButton},r.a.createElement(Ge.a,null)),r.a.createElement(Ne.a,{variant:"h6",noWrap:!0},e.title))),r.a.createElement("nav",{className:n.drawer,"aria-label":"mailbox folders"},r.a.createElement(Fe.a,{smUp:!0,implementation:"css"},r.a.createElement(Ie.a,{container:p,variant:"temporary",anchor:"rtl"===o.direction?"right":"left",open:l,onClose:m,classes:{paper:n.drawerPaper},ModalProps:{keepMounted:!0}},d)),r.a.createElement(Fe.a,{xsDown:!0,implementation:"css"},r.a.createElement(Ie.a,{classes:{paper:n.drawerPaper},variant:"permanent",open:!0},d))),r.a.createElement("main",{className:n.content},r.a.createElement("div",{className:n.toolbar}),e.children))},_e=a(92),qe=a(194),Ve=a(186),Ke=["children","value","index"],He=function(e){var t=e.children,a=e.value,n=e.index,o=Object(_e.a)(e,Ke);return r.a.createElement("div",Object.assign({role:"tabpanel",hidden:a!==n,id:"scrollable-auto-tabpanel-".concat(n),"aria-labelledby":"scrollable-auto-tab-".concat(n)},o),a===n&&r.a.createElement(J.a,{p:3},r.a.createElement(Ne.a,null,t)))};var Qe=Object(O.a)((function(e){return{root:{flexGrow:1,width:"100%",backgroundColor:e.palette.background.paper,marginTop:e.spacing(4)}}})),$e=function(e){var t=e.tabEntries,a=Qe(),n=Object(u.a)(e.tabIdx,2),o=n[0],c=n[1];return r.a.createElement("div",{className:a.root},r.a.createElement(we.a,{position:"static",color:"default"},r.a.createElement(qe.a,{value:o,onChange:function(e,t){c(t)},indicatorColor:"primary",textColor:"primary",variant:"scrollable",scrollButtons:"auto","aria-label":"scrollable auto tabs example"},t.map((function(e,t){return r.a.createElement(Ve.a,Object.assign({label:e.label},{id:"scrollable-auto-tab-".concat(a=t),"aria-controls":"scrollable-auto-tabpanel-".concat(a)}));var a})))),t.map((function(e,t){return r.a.createElement(He,{value:o,index:t},e.component)})))},Ze=function(){var e=r.a.useMemo((function(){return Object(d.a)({palette:{primary:{light:"#cb4584",main:"#960057",dark:"#cb4584",contrastText:"#fff"},secondary:{light:"#ffffff",main:"#e3e8ed",dark:"#b1b6bb",contrastText:"#000"}}})}),[]),t=Object(n.useState)({}),a=Object(u.a)(t,2),o=a[0],c=a[1],s=Object(n.useState)([]),v=Object(u.a)(s,2),y=v[0],k=v[1],A=Object(n.useState)([]),O=Object(u.a)(A,2),j=O[0],T=O[1],C=Object(n.useState)(0),w=Object(n.useState)(0),R=Object(n.useState)(""),N=Object(u.a)(R,2),F=N[0],I=N[1],P=Object(n.useState)({}),D=Object(u.a)(P,2),G=D[0],L=D[1],z=Object(n.useState)({}),U=Object(u.a)(z,2),M={tx:G,setTx:L,txStatus:F,setTxStatus:I,txRes:U[0],setTxRes:U[1]},B=function(){var e=Object(i.a)(l.a.mark((function e(){var t;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ve("view-state");case 2:t=e.sent,c(t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),W=function(){var e=Object(i.a)(l.a.mark((function e(){var t;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ve("view-ambassadors");case 2:t=e.sent,T(t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),J=function(){var e=Object(i.a)(l.a.mark((function e(){var t;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ve("view-guardians");case 2:t=e.sent,k(t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(n.useEffect)((function(){J(),B(),W(),console.log("useEffect []",y,j)}),[]),r.a.createElement(p.a,{theme:e},r.a.createElement(f.a,null,r.a.createElement(b.a,null),r.a.createElement(m.a,{basename:"/dao.init-frontend"},r.a.createElement(Je,{title:"dao.init",entriesList:[[{primary:"Config",to:"/config"},{primary:"Init State",to:"/initState"},{primary:"Ambassadors",to:"/ambassadors"},{primary:"Guardians",to:"/guardians"}]]},r.a.createElement(x.a,null,r.a.createElement(m.e,null,r.a.createElement(m.c,{path:"/config",component:function(){return r.a.createElement(g.a,null,r.a.createElement(E.a,{title:"Contract and UI Configuration"}),r.a.createElement(h.a,null,r.a.createElement(Se,null)))}}),r.a.createElement(m.c,{path:"/initState",component:function(){return r.a.createElement(g.a,null,r.a.createElement(E.a,{title:"Contract State"}),r.a.createElement(h.a,null,r.a.createElement(ye,{initState:o})))}}),r.a.createElement(m.c,{path:"/guardians",component:function(){return r.a.createElement(g.a,null,r.a.createElement(E.a,{title:"Guardians"}),r.a.createElement(h.a,null,r.a.createElement(S.a,{onClick:function(){return J()}},"getGuardians"),r.a.createElement(ce,{guardians:y}),r.a.createElement($e,{tabIdx:w,tabEntries:[{label:"Register Guardian",component:r.a.createElement(pe,{pactTxStatus:M,refresh:function(){return J()}})},{label:"Rotate Guardian",component:r.a.createElement(ue,{guardians:y,ambassadors:j,pactTxStatus:M,refresh:function(){return W()}})},{label:"Propose DAO Upgrade",component:r.a.createElement(me,{guardians:y,pactTxStatus:M,refresh:function(){return W()}})},{label:"Approve DAO Upgrade",component:r.a.createElement(de,{guardians:y,pactTxStatus:M,refresh:function(){return W()}})}]})))}}),r.a.createElement(m.c,{path:"/ambassadors",component:function(){return r.a.createElement(g.a,null,r.a.createElement(E.a,{title:"Ambassadors"}),r.a.createElement(h.a,null,r.a.createElement(be,{ambassadors:j}),r.a.createElement($e,{tabIdx:C,tabEntries:[{label:"Register Ambassador",component:r.a.createElement(se,{guardians:y,pactTxStatus:M,refresh:function(){return W()}})},{label:"Deactivate Ambassador",component:r.a.createElement(le,{guardians:y,ambassadors:j,pactTxStatus:M,refresh:function(){return W()}})},{label:"Reactivate Ambassador",component:r.a.createElement(ie,{guardians:y,ambassadors:j,pactTxStatus:M,refresh:function(){return W()}})},{label:"Rotate Ambassador",component:r.a.createElement(he,{ambassadors:j,pactTxStatus:M,refresh:function(){return W()}})},{label:"Vote to Freeze",component:r.a.createElement(ge,{ambassadors:j,pactTxStatus:M,refresh:function(){return W()}})},{label:"Freeze",component:r.a.createElement(Ee,{ambassadors:j,pactTxStatus:M,refresh:function(){return W()}})}]})))}}),r.a.createElement(m.c,{path:"/"},r.a.createElement(m.b,{to:"/config"}))))))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(Ze,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},7:function(e,t){var a="https://".concat("api.testnet.chainweb.com","/chainweb/0.0/").concat("testnet04","/chain/").concat("0","/pact"),n={contractName:"init",gasStationName:"memory-wall-gas-station",namespace:"free",contractAddress:"".concat("free",".").concat("init"),gasStationAddress:"".concat("free",".").concat("memory-wall-gas-station"),explorerURL:"https://explorer.chainweb.com/".concat("testnet04".slice(0,-2)),constants:{DAO_ACCT_NAME:"init",GUARDIAN_KDA_REQUIRED:.5},meta:{networkId:"testnet04",chainId:"0",host:a,creationTime:function(){return Math.round((new Date).getTime()/1e3)-15},gasPrice:1e-11,gasLimit:1e4,ttl:28800,sender:"mw-free-gas",nonce:"some nonce that doesnt matter"}};e.exports={kadenaAPI:n,keyFormatter:function(e){return e.replace(new RegExp("[A-Z]+","gm")," $&").replace(new RegExp("^[a-z]","gm"),(function(e){return e.toUpperCase()}))}}}},[[104,1,2]]]);
//# sourceMappingURL=main.ff7caade.chunk.js.map