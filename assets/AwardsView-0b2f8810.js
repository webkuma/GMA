import{u as g,r as d,o as x,f as Y,a as c,c as i,w as m,v as C,b as e,F as k,d as $,t as p,e as j,g as h,h as f,i as w,j as S,k as y,R as b,l as B}from"./index-1411da43.js";import{L as D}from"./Loading-8eb1f0f0.js";import{e as u}from"./emitter-7f99bbc0.js";const N={class:"flex"},R=["value"],V={__name:"YearSelect",setup(v){const n=g(),r=d(),s=d("");x(async()=>{await n.isReady(),l()});async function l(){const t=await Y();r.value=t.map(o=>o.year),s.value=n.currentRoute.value.params.year,u.emit("yearChange",s.value)}function _(t){n.push({path:`/Awards/${t}`}),u.emit("yearChange",t)}return(t,o)=>(c(),i("div",N,[m(e("select",{onChange:o[0]||(o[0]=a=>_(s.value)),"onUpdate:modelValue":o[1]||(o[1]=a=>s.value=a),class:"bg-gray-50 border-1 border-cg3 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4"},[(c(!0),i(k,null,$(r.value,a=>(c(),i("option",{value:a,key:a},p(a),9,R))),128))],544),[[C,s.value]])]))}},A={class:"place-items-center place-content-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"},F=["onClick"],L=e("span",{class:"absolute inset-2 bg-black opacity-10 rounded-md","aria-hidden":"true"},null,-1),M={class:"absolute text-xl font-bold"},U=["src"],q={__name:"YearAwardsData",setup(v){u.on("yearChange",t=>{r.value=t,l(t)});const n=g(),r=d(),s=d();x(async()=>{await n.isReady()});async function l(t){const o=await j(t);o.length?s.value=o:u.emit("isNotFoundYear",!0)}function _(t){n.push({path:`/Awards/${r.value}/${t}`})}return(t,o)=>(c(),i("div",A,[(c(!0),i(k,null,$(s.value,a=>(c(),i("div",{class:"relative w-60 h-60 flex items-center justify-center bg-cg4 rounded-md cursor-pointer m-4",key:a.id,onClick:ae=>_(a.awards)},[L,e("span",M,p(a.awards),1),e("img",{src:a.url,class:"p-2 rounded-xl w-60 h-60 aspect-square",alt:"awards img"},null,8,U)],8,F))),128))]))}},z={class:"text-white"},E={key:0,class:"z-20 absolute w-full h-full top-0 bg-[#202020]/90 bg-opacity-90"},T={class:"flex flex-col items-center justify-center h-full text-white"},X=e("p",{class:"text-6xl text-custom-gold"},"(='X'=)",-1),Z=e("p",{class:"text-2xl m-4"},"年份錯誤（無此年份）",-1),G={class:"text-lg"},H=e("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-4 h-4 mr-1"},[e("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"})],-1),I=e("span",null,"返回首頁",-1),J={class:"flex justify-between p-4"},K={class:"flex justify-between items-center"},O={class:"flex justify-between items-center p-3 text-gray-700 border-1 border-cg3 rounded-lg bg-gray-50","aria-label":"Breadcrumb"},P={class:"inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"},Q={class:"inline-flex items-center"},W=e("a",{href:"#",class:"inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"},[e("svg",{class:"w-3 h-3 me-2","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 20 20"},[e("path",{d:"m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"})]),B(" 首頁 ")],-1),ee={class:"flex items-center"},te=e("svg",{class:"rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 6 10"},[e("path",{stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"m1 9 4-4-4-4"})],-1),se={class:"ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"},le={__name:"AwardsView",setup(v){u.on("isNotFoundYear",l=>{s.value=l}),u.on("yearChange",l=>{r.value=l});const n=g(),r=d(),s=d(!1);return x(async()=>{await n.isReady()}),(l,_)=>(c(),i("main",z,[s.value?(c(),i("div",E,[e("div",T,[X,Z,e("p",G,[h(w(b),{to:"/",class:"p-3 flex items-center justify-center text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 font-medium rounded-lg text-sm"},{default:f(()=>[H,I]),_:1})])])])):S("",!0),e("div",null,[m(h(D,null,null,512),[[y,!r.value]]),m(e("div",J,[e("div",K,[e("nav",O,[e("ol",P,[e("li",Q,[h(w(b),{to:"/",class:"flex items-center"},{default:f(()=>[W]),_:1})]),e("li",null,[e("div",ee,[te,e("a",se,p(r.value)+" 年 ",1)])])])])]),h(V)],512),[[y,r.value]]),h(q)])]))}};export{le as default};
