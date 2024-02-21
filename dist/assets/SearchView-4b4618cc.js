import{u as D,m as B,n as W,r as g,o as j,p as A,a as s,b as o,h as d,f as r,d as e,e as b,w as V,q as x,l as S,F as _,j as f,t as c,L as R,R as $,i as k}from"./index-2a38b5bf.js";const F={class:"text-white"},I=e("button",{type:"button","data-te-ripple-init":"","data-te-ripple-color":"light",class:"!fixed bottom-5 right-5 rounded-full bg-red-600 p-3 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg",id:"btn-back-to-top",style:{}},[e("svg",{"aria-hidden":"true",focusable:"false","data-prefix":"fas",class:"h-4 w-4",role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 448 512"},[e("path",{fill:"currentColor",d:"M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"})])],-1),M=[I],U={key:1,class:"absolute w-full h-full bg-[#202020] bg-opacity-90"},Y={class:"flex items-center justify-center h-full"},z={key:2},H={class:"p-4 flex sm:flex-row justify-between items-center"},q={class:"flex justify-between items-center p-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50","aria-label":"Breadcrumb"},G={class:"inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"},O={class:"inline-flex items-center"},Z=e("a",{href:"#",class:"inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"},[e("svg",{class:"w-3 h-3 me-2","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 20 20"},[e("path",{d:"m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"})]),S(" 首頁 ")],-1),P=e("li",null,[e("div",{class:"flex items-center"},[e("svg",{class:"rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 6 10"},[e("path",{stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"m1 9 4-4-4-4"})]),e("a",{class:"ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"}," 搜尋 ")])],-1),X={class:"flex justify-end gap-2"},J=e("span",{class:"mr-1"},"年份",-1),K=e("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M4.5 15.75l7.5-7.5 7.5 7.5"},null,-1),Q={key:0},ee=e("div",{class:"mx-4"},[e("span",{class:"border-b-4 border-custom-gold text-2xl"},"2010～2023 年獲獎次數排行 ")],-1),te={class:"p-4 text-xl text-yellow-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1"},se=["onClick"],oe={class:"w-24 h-24 rounded-lg aspect-square",alt:"album"},re={class:"flex flex-col justify-evenly pl-4"},ae={class:"text-lg font-semibold text-gray-900"},ne={class:"text-lg font-semibold text-gray-900"},le={key:1,class:"flex flex-col justify-center items-center"},ie=e("p",{class:"text-6xl text-custom-gold"},"(='X'=)",-1),ce={class:"text-2xl m-4"},de=e("p",{class:"text-xl"},"請嘗試用不同關鍵字再搜尋一次。",-1),ue={key:2},he={class:"mx-4"},ge={class:"pr-1 border-b-4 border-custom-gold text-2xl"},xe={class:"p-4 grid grid-cols-1 lg:grid-cols-2 gap-4"},_e={class:"flex items-center justify-end mr-4"},fe=["onClick"],me=e("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"},null,-1),ve=[me],we={class:"mr-4 w-20 h-20 sm:w-32 sm:h-32 rounded-lg aspect-square",alt:"album pic"},pe={class:"flex flex-col justify-evenly pl-2"},ye=["onClick"],be={class:"text-base sm:text-xl font-semibold text-gray-700"},ke=["onClick"],Se=`
SELECT
    nominee AS "nominee",
    MIN(url) AS "url",
    COUNT(CASE WHEN won = 1 THEN 1 END) AS "won",
    COUNT(*) AS "nomineeTime",
    id
FROM
    shortlist
GROUP BY
    nominee
HAVING
    COUNT(CASE WHEN won = 1 THEN 1 END) > 0
ORDER BY
    won DESC;
`,Le={__name:"SearchView",setup(Ce){const C=D(),m=B(),t=W(),u=g(),h=g(!1),v=g();j(async()=>{await C.isReady(),u.value||(await m.getWonListData(Se),u.value=m.mountedWonList)});function E(){h.value=!h.value,h.value?t.yearsData.sort((a,i)=>a.year-i.year):t.yearsData.sort((a,i)=>i.year-a.year)}function L(){window.scrollTo({top:0,behavior:"smooth"})}window.addEventListener("scroll",N);function N(){const a=window.scrollY;v.value=a>200?1:0}function T(a){!!localStorage.getItem(`favoriteStorage-${a}`)?(localStorage.removeItem(`favoriteStorage-${a}`),t.updateYearsDataStorage(a,!1)):(localStorage.setItem(`favoriteStorage-${a}`,"id"),t.updateYearsDataStorage(a,!0))}return(a,i)=>{const w=A("lazy");return s(),o("main",F,[v.value?(s(),o("div",{key:0,class:"fixed right-5 bottom-5 z-50",onClick:L},M)):d("",!0),!u.value||r(t).state.Searching?(s(),o("div",U,[e("div",Y,[b(R)])])):(s(),o("div",z,[e("div",H,[e("nav",q,[e("ol",G,[e("li",O,[b(r($),{to:"/",class:"inline-block"},{default:V(()=>[Z]),_:1})]),P])]),e("div",X,[!r(t).state.UnsearchedState&&!r(t).state.Searching?(s(),o("button",{key:0,onClick:i[0]||(i[0]=l=>r(t).backWonList()),type:"button",class:"p-3 text-gray-900 bg-gradient-to-r from-red-200 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm text-center"}," 回獲獎列表 ")):d("",!0),r(t).state.SearchedFound?(s(),o("button",{key:1,onClick:i[1]||(i[1]=l=>E()),type:"button",class:"flex items-center justify-center p-3 text-gray-900 bg-gradient-to-r from-yellow-200 to-red-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm text-center"},[J,(s(),o("svg",{id:"filterArrow",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:x(["w-4 h-4 transition-transform duration-500",[h.value?"rotate-0 ":"rotate-180"]])},[S(" > "),K],2))])):d("",!0)])]),r(t).state.UnsearchedState?(s(),o("div",Q,[ee,e("div",te,[(s(!0),o(_,null,f(u.value,(l,n)=>(s(),o("div",{key:n,class:"flex shadow-custom-inner shadow-yellow-500 sh mx-2 mt-5 p-4 rounded-lg bg-[#F5E8C7] hover:cursor-pointer",onClick:p=>r(t).setSearchWord(l.nominee)},[k(e("img",oe,null,512),[[w,l.url]]),e("div",re,[e("p",ae,c(l.nominee),1),e("p",ne,"獲獎: "+c(l.won)+" / 提名: "+c(l.nomineeTime),1)])],8,se))),128))])])):d("",!0),r(t).state.SearchedNotFound?(s(),o("div",le,[ie,e("p",ce,"找不到「"+c(r(t).searchWord)+"」",1),de])):d("",!0),r(t).state.SearchedFound?(s(),o("div",ue,[(s(!0),o(_,null,f(r(t).yearsData,l=>(s(),o("div",{key:l.year,class:"text-xl text-yellow-50"},[e("div",he,[e("span",ge,c(l.year),1)]),e("div",xe,[(s(!0),o(_,null,f(l.data,(n,p)=>(s(),o("div",{key:p,class:x(["relative flex shadow-custom-inner shadow-yellow-500 mx-2 mt-4 p-4 border rounded-lg",{"bg-[#F5E8C7]":n.won,"bg-gray-200 ":!n.won}])},[e("div",_e,[(s(),o("svg",{onClick:y=>T(n.id),xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1",stroke:"currentColor",class:x(["w-6 h-6 cursor-pointer stroke-red-500",[n.isStoraged?"fill-red-500 ":" fill-gray-200"]])},ve,10,fe))]),k(e("img",we,null,512),[[w,n.url]]),e("div",pe,[e("div",null,[e("span",{class:"text-base sm:text-xl font-semibold text-gray-700 cursor-pointer",onClick:y=>r(t).setSearchWord(n.nominee)},c(n.nominee),9,ye),e("span",be,"／ "+c(n.work),1)]),e("p",{onClick:y=>r(t).setSearchWord(n.awards),class:"text-base font-semibold text-gray-500 cursor-pointer"},c(n.awards),9,ke)])],2))),128))])]))),128))])):d("",!0)]))])}}};export{Le as default};
