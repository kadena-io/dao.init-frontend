(this["webpackJsonpdao.init-frontend"]=this["webpackJsonpdao.init-frontend"]||[]).push([[0],{182:function(e,t,a){e.exports=a(335)},196:function(e,t){},333:function(e,t,a){},335:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(37),c=a.n(o),i=a(54),l=a(16),u=a.n(l),s=a(29),m=a(10),d=a(146),p=a(11),f=a(346),h=a(352),g=a(164),E=(a(349),a(347),a(344),a(336),a(31)),b=a.n(E),v=a(9),y=a(348),k=function(e){return e.split("-").map((function(e){return e.replace(new RegExp("^.","gm"),(function(e){return e.toUpperCase()}))})).join(" ")},j=function(e){return"object"!==typeof e||("timep"in e||"int"in e||"decimal"in e||"time"in e||"pred"in e&&"keys"in e)},w=function(e){return"object"===typeof e?"time"in e?e.time:"timep"in e?e.timep:"int"in e?"string"===typeof e.int?e.int:e.int.toLocaleString():"decimal"in e?"string"===typeof e.decimal?e.decimal:e.decimal.toLocaleString():JSON.stringify(e):"boolean"===typeof e?e.toString():"string"===typeof e?e:"number"===typeof e?e.toLocaleString():JSON.stringify(e)},A=function e(t){var a=t.json||{},n=t.removeMargin||!1,o=t.header||[],c=t.keyFormatter?t.keyFormatter:function(e){return e},i=t.valFormatter?t.valFormatter:function(e){return r.a.createElement("code",null,w(e))};return r.a.createElement(y.a,{simple:!0,collapsing:!0,celled:!0,style:n?{margin:"0 auto","border-radius":"0","border-bottom":"0","border-right":"0"}:{}},r.a.createElement(y.a.Header,null,r.a.createElement(y.a.Row,null,o.map((function(e){return r.a.createElement(y.a.HeaderCell,null,e)})))),r.a.createElement(y.a.Body,null,Object.entries(a).map((function(t){var a=Object(m.a)(t,2),n=a[0],o=a[1];return r.a.createElement(y.a.Row,null,r.a.createElement(y.a.Cell,null,r.a.createElement("h4",null,c(n))),j(o)?r.a.createElement(y.a.Cell,null,i(o)):"object"===typeof o?r.a.createElement(e,{json:o,keyFormatter:c,valFormatter:i,removeMargin:!0}):"function"===typeof o?r.a.createElement(y.a.Cell,null,i(o.toString())):r.a.createElement(y.a.Cell,null,i(o)))}))))},O=function e(t){var a=t.json||{},n=t.removeMargin||!1,o=t.header||[],c=[];t.keyOrder?c=t.keyOrder:Array.isArray(t.json)&&a.length>0&&(c=Object.keys(a[0])),console.log("PactJsonListAsTable",a,o,c);var i=t.keyFormatter?t.keyFormatter:function(e){return e},l=t.valFormatter?t.valFormatter:function(e){return r.a.createElement("code",null,w(e))};return r.a.createElement(y.a,{simple:!0,collapsing:!0,celled:!0,style:n?{margin:"0 auto",borderRadius:"0",borderBottom:"0",borderRight:"0"}:{}},r.a.createElement(y.a.Header,null,r.a.createElement(y.a.Row,null,o.map((function(e){return r.a.createElement(y.a.HeaderCell,null,e)})))),r.a.createElement(y.a.Body,null,a.map((function(t){return r.a.createElement(y.a.Row,null,c.map((function(a){var n=t[a];return j(n)?r.a.createElement(y.a.Cell,null,l(n)):Array.isArray(n)?r.a.createElement(y.a.Cell,{style:{margin:"0 auto",borderRadius:"0",borderBottom:"0",borderRight:"0",padding:"0"}},r.a.createElement(e,{json:n,keyFormatter:i,valFormatter:l,removeMargin:!0})):"object"===typeof n?r.a.createElement(y.a.Cell,{style:{margin:"0 auto",borderRadius:"0",borderBottom:"0",borderRight:"0",padding:"0"}},r.a.createElement(A,{json:n,keyFormatter:i,valFormatter:l,removeMargin:!0})):"function"===typeof n?r.a.createElement(y.a.Cell,null,l(n.toString())):r.a.createElement(y.a.Cell,null,l(n))})))}))))},I=a(38),x=function(e){return r.a.createElement(O,{header:["Guardian","Committed KDA","Approved Hash","Approval Date","Guard"],keyOrder:["k","committed-kda","approved-hash","approved-date","guard"],json:e.guardians})},C=function(e){return r.a.createElement(O,{header:["Ambassador","Active","Voted to Freeze","Guard"],keyOrder:["k","active","voted-to-freeze","guard"],json:e.ambassadors})},F=function(){return r.a.createElement(A,{json:v.kadenaAPI,keyFormatter:v.keyFormatter})},S=function(){var e=Object(s.a)(u.a.mark((function e(t){var a,n;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b.a.fetch.local({pactCode:"(".concat(v.kadenaAPI.contractAddress,".").concat(t,")"),meta:b.a.lang.mkMeta(v.kadenaAPI.meta.sender,v.kadenaAPI.meta.chainId,v.kadenaAPI.meta.gasPrice,v.kadenaAPI.meta.gasLimit,v.kadenaAPI.meta.creationTime(),v.kadenaAPI.meta.ttl)},v.kadenaAPI.meta.host);case 2:return a=e.sent,n=a.result.data,console.log("local query data",n),e.abrupt("return",n);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),R=function(e){return r.a.createElement(A,{json:e.initState,header:["","Status"],keyFormatter:k})},P=a(161),M=a(162),L=a(169),B=a(168),H=a(350),G=a(345),J=function(e){Object(L.a)(a,e);var t=Object(B.a)(a);function a(){return Object(P.a)(this,a),t.apply(this,arguments)}return Object(M.a)(a,[{key:"render",value:function(){for(var e=r.a.createElement(I.a,{name:this.props.headerIcon,size:"large"}),t=[],a=0;a<this.props.items.length;a++){if(2!==this.props.items[a].length){console.error('HeaderMenu: items format should be ["name", "route"]');break}var n=this.props.items[a][0],o=this.props.items[a][1];t.push(r.a.createElement(H.a.Item,{key:"item-"+a,index:a,as:i.b,to:o,header:0===a,active:o===this.props.location.pathname},0===a?e:"",n))}return r.a.createElement(H.a,{fixed:"top",inverted:!0},r.a.createElement(G.a,null,t))}}]),a}(n.Component),z=Object(p.f)(J),N=void 0;function T(){var e=Object(d.a)(["\n  display: flex;\n  min-height: 100vh;\n  flex-direction: column;\n"]);return T=function(){return e},e}var U=function(){return r.a.createElement("h1",null,"Welcome to dao.init")},D=function(){return r.a.createElement("h1",null,"URL doesn't exist")},K=(g.a.div(T()),function(){var e=Object(n.useState)({}),t=Object(m.a)(e,2),a=t[0],o=t[1],c=Object(n.useState)([]),i=Object(m.a)(c,2),l=i[0],d=i[1],g=Object(n.useState)([]),E=Object(m.a)(g,2),b=E[0],v=E[1],y=function(){var e=Object(s.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,S("view-state");case 2:t=e.sent,o(t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),k=function(){var e=Object(s.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,S("view-ambassadors");case 2:t=e.sent,v(t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),j=function(){var e=Object(s.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,S("view-guardians");case 2:t=e.sent,d(t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(n.useEffect)((function(){y(),k(),j()}),[]),r.a.createElement(r.a.Fragment,null,r.a.createElement(z,{onItemClick:function(e){return N.onItemClick(e)},items:[["Home","/"],["Config","/KadenaConfig"],["Init State","/InitState"],["Guardians","/Guardians"],["Ambassadors","/Ambassadors"]],headerIcon:"compass outline"}),r.a.createElement(f.a,null),r.a.createElement(h.a,null,r.a.createElement(p.c,null,r.a.createElement(p.a,{path:"/",exact:!0,component:U}),r.a.createElement(p.a,{path:"/KadenaConfig",component:function(){return r.a.createElement(F,null)}}),r.a.createElement(p.a,{path:"/InitState",component:function(){return r.a.createElement(R,{initState:a})}}),r.a.createElement(p.a,{path:"/Guardians",component:function(){return r.a.createElement(x,{guardians:l})}}),r.a.createElement(p.a,{path:"/Ambassadors",component:function(){return r.a.createElement(C,{ambassadors:b})}}),r.a.createElement(p.a,{component:D}))))});a(333),a(334),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(i.a,{basename:"/dao.init-frontend"},r.a.createElement(K,null)),","),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},9:function(e,t){var a="https://".concat("api.testnet.chainweb.com","/chainweb/0.0/").concat("testnet04","/chain/").concat("0","/pact"),n={contractName:"init",gasStationName:"memory-wall-gas-station",namespace:"free",contractAddress:"".concat("free",".").concat("init"),gasStationAddress:"".concat("free",".").concat("memory-wall-gas-station"),explorerURL:"https://explorer.chainweb.com/".concat("testnet04".slice(0,-2)),meta:{networkId:"testnet04",chainId:"0",host:a,creationTime:function(){return Math.round((new Date).getTime()/1e3)-15},gasPrice:1e-11,gasLimit:1e4,ttl:28800,sender:"mw-free-gas",nonce:"some nonce that doesnt matter"}};e.exports={kadenaAPI:n,keyFormatter:function(e){return e.replace(new RegExp("[A-Z]+","gm")," $&").replace(new RegExp("^[a-z]","gm"),(function(e){return e.toUpperCase()}))}}}},[[182,1,2]]]);
//# sourceMappingURL=main.948bf9cc.chunk.js.map