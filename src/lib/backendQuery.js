import { supabase } from "@/lib/supabaseClient";

// 取得年份底下的資料（按下年份後取得該年份的資料 年份>獎項）
// select * from shortlist where year = '${year}' order by awards
export async function fetchShortlistByYear(parms) {
  const { data, error } = await supabase
  .from('shortlist')
  .select('*')
  .eq('year', `${parms}`)
  .order('id', { ascending: true });  // 降序排列

  if (error) {
    console.error('Error fetching shortlist:', error);
    throw error;
  }
  return data;
}

// 取得所有獎項名稱
// select awards from awards
export async function fetchAwardsList() {
  const { data, error } = await supabase
  .from('awards')
  .select('awards')

  if (error) {
    console.error('Error fetching awards:', error);
    throw error;
  }
  return data;
}

// before radio @change, set that awards won: 0 
// UPDATE shortlist SET won = 0 WHERE year = ${year} AND awards = '${awards}';
async function resetAwardWonStatus(parms) {
  const { year, awards } = parms;
  const { data, error } = await supabase
  .from('shortlist')
  .update({ won: 0 })
  .eq('year', `${year}`)
  .eq('awards', `${awards}`)

  if (error) {
    console.error('Error reset shortlist:', error);
    throw error;
  }
  return data;
}

// radio @change
// UPDATE shortlist SET won = 1 WHERE year = ${year} AND awards = '${awards}' AND nominee = '${nominee}' AND work = '${work}';
export async function updateAwardStatus(parms) {
  const res = await resetAwardWonStatus(parms);
  const { year, awards, nominee, work } = parms;

  const { data, error, status } = await supabase
  .from('shortlist')
  .update({ won: 1 })
  .eq('year', `${year}`)
  .eq('awards', `${awards}`)
  .eq('nominee', `${nominee}`)
  .eq('work', `${work}`)

  if (error) {
    console.error('Error Update shortlist:', error);
    throw error;
  }
  return status;
}

// 新增年份
// INSERT INTO shortlist (awards, nominee, work, year, won, url) 
// VALUES ('年度歌曲獎', 'nominee', 'work', ${year}, 1, '')`;
export async function addNewYearEntry(parms) {
  const { data, error, status } = await supabase
  .from('shortlist')
  .insert({ awards: '年度歌曲獎', nominee: '尚未開獎', work: '尚未開獎', year: `${parms}`, won: 1, url: 'https://i.kfs.io/article5_cover/global/11614984v1/fit/800x420.jpg'})
  .select()

  if (error) {
    console.error('Error Update shortlist:', error);
    throw error;
  }
  return status;
}

// 刪除年份
// INSERT INTO shortlist (awards, nominee, work, year, won, url)
// VALUES ('年度歌曲獎', 'nominee', 'work', ${year}, 1, '')`;
export async function deleteEntriesByYear(parms) {
  const { data, error, status } = await supabase
  .from('shortlist')
  .delete()
  .eq('year', `${parms}`)

  if (error) {
    console.error('Error delete shortlist year:', error);
    throw error;
  }
  return status;
}

// 取得年份底下的某個獎項資料(年份>獎項>資料) alert 顯示用
// SELECT * FROM shortlist WHERE year = '${year}' AND awards = '${awards}' ORDER BY awards
export async function getShortlistByYearAndAwards(parms) {
  const { year, awards} = parms;
  const { data, error } = await supabase
  .from('shortlist')
  .select('*')
  .eq('year', `${year}`)
  .eq('awards', `${awards}`)
  .order('awards', { ascending: true });  // 降序排列

  if (error) {
    console.error('Error fetching shortlist:', error);
    throw error;
  }
  return data;
}

// swal 先刪除後新增資料
  /* swal 刪除資料
   * Delete From shortlist WHERE year = '${year}' AND awards = '${awards}'
  */
  export async function deleteShortlistEntry(parms) {
    const { year, awards } = parms
    const { error, status } = await supabase
    .from('shortlist')
    .delete()
    .eq('year', `${year}`)
    .eq('awards', `${awards}`)

    if (error) {
      console.error('Error delete shortlist year and awards:', error);
      throw error;
    }
    return status;
  }

  /* swal 新增資料  
  * INSERT INTO shortlist (awards, nominee, work, year, won, url) VALUES (?, ?, ?, ?, ?, ?)
  * parms: Array()
  * 0: {awards: '年度歌曲獎', nominee: '楊乃文', work: '墮落 feat. Buddha Jump 佛跳牆《Flow》', year: 2024, won: 0, …}
  * 1: {awards: '年度歌曲獎', nominee: '張惠妹', work: '離別總是那麼突然《離別總是那麼突然》', year: 2024, won: 0, …}
  * 2: {awards: '年度歌曲獎', nominee: '滅火器', work: '家和萬事興《家和萬事興》', year: 2024, won: 0, …}
  */
  export async function addShortlistEntry(parms) {
    for (let e of parms) {
      const { error, status } = await supabase
      .from('shortlist')
      .insert({ awards: e.awards, nominee: e.nominee, work: e.work, year: e.year, won: e.won, url: e.url, kkbox_id: e.kkbox_id})
      .select()
    
      if (error) {
        console.error('Error Update shortlist:', error);
        throw error;
      }
    } 
  }