import{s as n}from"./index-3335ded1.js";const E="/GMA";let e=null;async function o(){if(e)return e;try{const t=await n({locateFile:r=>`https://sql.js.org/dist/${r}`}),a=fetch(`${E}/music.db`).then(r=>{if(!r.ok)throw new Error("Failed to fetch database file.");return r.arrayBuffer()}),[s,i]=await Promise.all([t,a]);return e=new s.Database(new Uint8Array(i)),e}catch(t){throw console.error("Database initialization failed:",t),t}}async function N(t){return(await o()).exec(`SELECT DISTINCT * FROM shortlist WHERE id IN (${t.join(", ")}) ORDER BY year DESC`)}async function H(){return(await o()).exec("select DISTINCT year from shortlist ORDER BY year DESC")}async function l(t){return(await o()).exec(`SELECT DISTINCT awards.awards, shortlist.url
    FROM awards, shortlist
    WHERE awards.awards = shortlist.awards
    AND shortlist.year = ${t}
    AND shortlist.won = 1
    ORDER BY CASE awards.awards
    WHEN '年度歌曲獎' THEN 1
    WHEN '年度專輯獎' THEN 2
    WHEN '最佳華語專輯獎' THEN 3
    WHEN '最佳華語男歌手獎' THEN 4
    WHEN '最佳華語女歌手獎' THEN 5
    WHEN '最佳新人獎' THEN 6
    WHEN '最佳台語專輯獎' THEN 7
    WHEN '最佳台語男歌手獎' THEN 8
    WHEN '最佳台語女歌手獎' THEN 9
    WHEN '最佳樂團獎' THEN 10
    WHEN '最佳演唱組合獎' THEN 11
    WHEN '最佳作詞人獎' THEN 12
    WHEN '最佳作曲人獎' THEN 13
    WHEN '最佳單曲製作人獎' THEN 14
    WHEN '最佳專輯製作人獎' THEN 15
    ELSE 99 -- 預設值
    END;`)}async function d(t,a){return(await o()).exec(`select * from shortlist where year = ${t} and awards = "${a}"`)}export{l as a,d as b,N as c,H as f};
