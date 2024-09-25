import{u as j,r as t,o as S,e as K,a as s,c as o,b as e,w as $,v as V,F as b,d as C,t as x,m as N,n as O,p as F,j as g,q as P,f as Z,g as m,h as A,i as B,k as L,R as D,l as I}from"./index-22819ee3.js";import{L as q}from"./Loading-715f9852.js";import{e as f}from"./emitter-7f99bbc0.js";import{i as y}from"./index-7824479e.js";const G={class:"flex lg:hidden mb-4"},U=["value"],W={class:"w-1/2 border-1 border-cg3 bg-cg2 rounded hidden lg:block"},X=e("h2",{class:"pt-4 text-2xl font-bold text-center text-black"},"看其他獎項",-1),E={class:"place-items-center place-content-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3"},z=["onClick"],H=e("span",{class:"absolute inset-1 bg-black opacity-30 rounded-md","aria-hidden":"true"},null,-1),J={class:"absolute font-bold"},Q=["src"],ee={__name:"Awards",setup(Y){const h=j(),w=t(),r=t(),_=t(),n=t("");S(async()=>{await h.isReady(),w.value=h.currentRoute.value.params.year,r.value=h.currentRoute.value.params.awards,window.scrollTo({top:0,behavior:"smooth"})}),f.on("yearChange",i=>{n.value=i,u(i)});async function u(i){const v=await K(i);v?_.value=v:f.emit("isNotFoundYear",!0)}function l(i){f.emit("updateSelectedYear",{year:n.value,awards:i}),h.push({path:`/Awards/${n.value}/${i}`})}return(i,v)=>(s(),o(b,null,[e("section",G,[$(e("select",{onChange:v[0]||(v[0]=c=>l(c.target.value)),"onUpdate:modelValue":v[1]||(v[1]=c=>r.value=c),class:"bg-gray-50 border-1 border-cg3 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-2"},[(s(!0),o(b,null,C(_.value,c=>(s(),o("option",{value:c.awards,key:c.id},x(c.awards),9,U))),128))],544),[[V,r.value]])]),e("section",W,[X,e("div",E,[(s(!0),o(b,null,C(_.value,c=>(s(),o("div",{class:"relative w-32 h-32 flex items-center justify-center bg-cg4 rounded-md cursor-pointer m-4",key:c.id,onClick:R=>l(c.awards)},[H,e("span",J,x(c.awards),1),e("img",{src:c.url,class:"p-1 rounded-xl w-32 h-32 aspect-square",alt:"awards img"},null,8,Q)],8,z))),128))])])],64))}},te={class:"w-full lg:w-1/2 flex flex-col border-1 border-cg3 bg-cg2 rounded"},se={class:"flex flex-col"},oe={class:"text-center mt-1"},ae={key:0,class:"text-white font-black bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-500 text-base p-3 text-center rounded-lg",type:"button","data-bs-toggle":"offcanvas","data-bs-target":"#demo"},le={class:"text-center"},re={class:"col-start-2 py-4 text-2xl font-bold text-black"},ne={key:0,class:"flex justify-center"},ce={key:0},de=["src"],ie={key:1,class:"flex justify-center"},ue=e("p",{class:"text-black font-bold border-1 bg-yellow-500 rounded-xl px-4 py-2"}," 這首找不到試聽資源 (*´･д･) ",-1),he=[ue],_e={class:"flex"},ve=["src"],xe={key:0,class:"flex flex-col justify-center text-red-700"},fe={class:"text-lg mb-1 font-extrabold"},we={class:"font-extrabold"},pe={key:1,class:"flex flex-col justify-center text-black"},ge={class:"text-lg mb-1 font-semibold"},me={class:"font-semibold"},be={class:"flex items-center justify-center"},ke=["onClick"],ye=e("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.0",stroke:"currentColor",class:"w-8 h-8 text-black"},[e("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"}),e("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"})],-1),$e=[ye],Ce=["onClick"],je=e("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.0",stroke:"currentColor",class:"w-8 h-8"},[e("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"}),e("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"})],-1),Se=[je],Ye=e("div",null,[e("p",{class:"p-2 text-gray-400"}," # 試聽找錯可能是金曲獎名稱與對方建立的 KKBOX 帳號不匹配或搜尋結果重複 ... ")],-1),Re={class:"offcanvas offcanvas-start text-bg-dark",id:"demo",style:{width:"350px"}},Te=e("div",{class:"offcanvas-header"},[e("h1",{class:"offcanvas-title"},"專輯試聽"),e("button",{type:"button",class:"btn-close btn-close-white border","data-bs-dismiss":"offcanvas"},[e("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:"{1.5}",stroke:"currentColor",className:"w-6 h-6"},[e("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18 18 6M6 6l12 12"})])])],-1),Ae={class:"offcanvas-body flex items-center justify-center"},Be={key:0},De={key:0},Me=["src"],Le={key:1,class:"flex justify-center"},Ve=e("p",{class:"text-black font-bold border-1 bg-yellow-500 rounded-xl px-4 py-2"}," 這首找不到試聽資源 (*´･д･) ",-1),Ke=[Ve],Ne={__name:"AwardsDetail",setup(Y){const h=N();O(),t();const w=t(1);t(0);const r=j(),_=t(),n=t();t(),t(),t(),t("");const u=t(),l=t(),i=t(),v=t(),c=t();S(async()=>{w.value=1,await r.isReady(),_.value=r.currentRoute.value.params.year,n.value=r.currentRoute.value.params.awards,window.scrollTo({top:0,behavior:"smooth"}),i.value=await h.getKkboxToken()}),f.on("yearChange",d=>{R(d)}),f.on("updateSelectedYear",({year:d,awards:p})=>{R(d,p)});async function R(d=null,p=null){_.value=d||_.value,n.value=p||n.value;const a=await F(_.value,n.value);a&&(u.value=a,console.log(u.value))}async function M(d,p,a){switch(a){case"年度歌曲獎":v.value=T(d)+" "+p,c.value="track";break;case"最佳作曲人獎":case"最佳作詞人獎":case"最佳單曲製作人獎":v.value=T(d),c.value="track";break;case"最佳專輯製作人獎":v.value=T(d),c.value="album";break;default:v.value=d+" "+p,c.value="album"}y.loading("Loading...",{position:y.POSITION.BOTTOM_RIGHT,autoClose:!0,theme:"dark",transition:"flip"});try{const k=await P(d,p,a);l.value=k[0].kkbox_id,y.clearAll()}catch(k){console.error(k),y.error("Error occurred",{autoClose:5e3}),y.clearAll()}}function T(d){return d.indexOf("《")!==-1?d.substring(0,d.indexOf("《")):d}return(d,p)=>(s(),o(b,null,[e("section",te,[e("div",se,[e("div",oe,[l.value&&n.value!=="年度歌曲獎"&&n.value!=="最佳作曲人獎"&&n.value!=="最佳作詞人獎"&&n.value!=="最佳單曲製作人獎"?(s(),o("button",ae," 專輯試聽側欄 ")):g("",!0)]),e("div",le,[e("h2",re,x(n.value),1)])]),l.value!=="null"?(s(),o("div",ne,[c.value==="track"?(s(),o("div",ce,[e("iframe",{class:"h-[100px] w-72",src:`https://widget.kkbox.com/v1/?id=${l.value}&type=song&terr=TW&lang=TC&autoplay=true`,allow:"autoplay"},null,8,de)])):g("",!0)])):g("",!0),l.value==="null"?(s(),o("div",ie,he)):g("",!0),(s(!0),o(b,null,C(u.value,a=>(s(),o("div",{class:"hover:bg-slate-300 flex justify-between rounded-md m-2",key:a.id},[e("div",_e,[e("img",{src:a.url,class:"row-span-2 p-2 rounded-xl w-20 h-20 aspect-square",alt:"awards img"},null,8,ve),a.won?(s(),o("div",xe,[e("span",fe,x(a.work),1),e("span",we,x(a.nominee),1)])):(s(),o("div",pe,[e("span",ge,x(a.work),1),e("span",me,x(a.nominee),1)]))]),e("div",be,[a.awards==="年度歌曲獎"||a.awards==="最佳作曲人獎"||a.awards==="最佳作詞人獎"||a.awards==="最佳單曲製作人獎"?(s(),o("button",{key:0,class:"py-2 px-4",type:"button",onClick:k=>M(a.work,a.nominee,a.awards)},$e,8,ke)):(s(),o("button",{key:1,"data-bs-toggle":"offcanvas","data-bs-target":"#demo",class:"py-2 px-4 text-black",type:"button",onClick:k=>M(a.work,a.nominee,a.awards)},Se,8,Ce))])]))),128)),Ye]),e("div",Re,[Te,e("div",Ae,[c.value==="album"?(s(),o("div",Be,[l.value!=="null"?(s(),o("div",De,[e("iframe",{class:"fixed top-[64px] left-3 h-[calc(100%-64px)] border-0",src:`https://widget.kkbox.com/v1/?id=${l.value}&type=album&terr=TW&lang=TC&autoplay=true`,allow:"autoplay"},null,8,Me)])):g("",!0),l.value==="null"?(s(),o("div",Le,Ke)):g("",!0)])):g("",!0)])])],64))}},Oe={class:"flex"},Fe=["value"],Pe={__name:"YearSelect",setup(Y){const h=j(),w=t(),r=t("");S(async()=>{await h.isReady(),_()});async function _(){const u=await Z();w.value=u.map(l=>l.year),r.value=h.currentRoute.value.params.year,f.emit("yearChange",r.value)}function n(u){h.push({path:`/Awards/${u}/${h.currentRoute.value.params.awards}`}),f.emit("yearChange",u)}return(u,l)=>(s(),o("div",Oe,[$(e("select",{onChange:l[0]||(l[0]=i=>n(r.value)),"onUpdate:modelValue":l[1]||(l[1]=i=>r.value=i),class:"bg-gray-50 border-1 border-cg3 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-2"},[(s(!0),o(b,null,C(w.value,i=>(s(),o("option",{value:i,key:i},x(i),9,Fe))),128))],544),[[V,r.value]])]))}},Ze={class:"text-white"},Ie={key:0,class:"z-20 absolute w-full h-full bg-[#202020]/90 bg-opacity-90"},qe={class:"flex flex-col items-center justify-center h-full text-white"},Ge=e("p",{class:"text-6xl text-custom-gold"},"(='X'=)",-1),Ue=e("p",{class:"text-2xl m-4"},"年份錯誤",-1),We={class:"text-lg"},Xe=e("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-4 h-4 mr-1"},[e("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"})],-1),Ee=e("span",null,"返回首頁",-1),ze={class:"flex flex-col lg:flex-row gap-4 justify-between p-4"},He={class:"flex justify-between items-center"},Je={class:"flex justify-between items-center p-3 text-gray-700 border-1 border-cg3 rounded-lg bg-gray-50","aria-label":"Breadcrumb"},Qe={class:"inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"},et={class:"inline-flex items-center"},tt=e("a",{href:"#",class:"inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"},[e("svg",{class:"w-3 h-3 me-2","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 20 20"},[e("path",{d:"m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"})]),I(" 首頁 ")],-1),st={class:"flex items-center"},ot=e("svg",{class:"rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 6 10"},[e("path",{stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"m1 9 4-4-4-4"})],-1),at={class:"ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"},lt={class:"flex items-center"},rt=e("svg",{class:"rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 6 10"},[e("path",{stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"m1 9 4-4-4-4"})],-1),nt={class:"ms-1 text-sm font-medium text-gray-900 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"},ct={class:"flex flex-col lg:flex-row gap-3 px-4"},_t={__name:"AwardsDetailView",setup(Y){const h=j(),w=t(),r=t(),_=t(),n=t(!1);return f.on("isNotFoundYear",()=>{w.value=!0}),f.on("updateSelectedYear",({year:u,awards:l})=>{r.value=u,_.value=l}),f.on("yearChange",u=>{r.value=u,n.value=!0}),S(async()=>{await h.isReady(),r.value=h.currentRoute.value.params.year,_.value=h.currentRoute.value.params.awards,window.scrollTo({top:0,behavior:"smooth"})}),(u,l)=>(s(),o("main",Ze,[w.value?(s(),o("div",Ie,[e("div",qe,[Ge,Ue,e("p",We,[m(B(D),{to:"/",class:"p-3 flex items-center justify-center text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 font-medium rounded-lg text-sm"},{default:A(()=>[Xe,Ee]),_:1})])])])):g("",!0),$(m(q,null,null,512),[[L,!n.value]]),$(e("div",null,[e("div",ze,[e("div",He,[e("nav",Je,[e("ol",Qe,[e("li",et,[m(B(D),{to:"/",class:"flex items-center"},{default:A(()=>[tt]),_:1})]),e("li",null,[e("div",st,[ot,m(B(D),{to:`/Awards/${r.value}`,class:"flex items-center"},{default:A(()=>[e("a",at,x(r.value)+" 年 ",1)]),_:1},8,["to"])])]),e("li",null,[e("div",lt,[rt,e("a",nt,x(_.value),1)])])])])]),m(Pe)]),e("div",ct,[m(ee),m(Ne)])],512),[[L,n.value]])]))}};export{_t as default};
