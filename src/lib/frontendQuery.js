import { supabase } from "@/lib/supabaseClient";

// src\views\AwardsView.vue 的子組件(YearSelect.vue) 下拉選單『獲取全部年份』
// fetchshortlistyear view: `select DISTINCT year from shortlist ORDER BY year DESC`
export async function fetchShortlistYear() {
  const { data, error } = await supabase.from('fetchshortlistyear').select('*');
  if (error) {
    console.error('Error fetching shortlist years:', error);
    throw error;
  }
  return data;
}

// src\views\AwardsView.vue 的子組件(YearAwardsData.vue) 取得該年份的獎項名稱、得獎作品圖片
// SELECT DISTINCT id, awards, url FROM shortlist 
// WHERE year = `${year}` AND shortlist.won = '1'
export async function fetchShortlistAwardsData(parms) {
  const { data, error } = await supabase
    .from('shortlist')
    .select('id, awards, url')
    .eq('year', parms)
    .eq('won', '1')

  return data;
}

/**
 * 獲取特定年份和獎項的入圍名單
 * @param {string} params.year - 查詢的年份
 * @param {string} params.awards - 查詢的獎項
 */
export async function fetchShortlist(params) {
  const { year, awards } = params;
  const { data, error } = await supabase
    .from('shortlist')
    .select('*')
    .eq('year', year)
    .eq('awards', awards)
    .neq('nominee', '尚未開獎');

  if (error) {
    console.error('Error fetching shortlist data:', error);
    throw error;
  }
  return data;
}

/* src\views\AwardsDetailView.vue 的子組件(AwardsDetail.vue) 
 * 例如取得：『2024/最佳華語專輯獎』所有入圍該年份+獎項的資訊
 * `select * from shortlist where year = ${year} and awards = "${awards}"`
*/
export async function fetchShortlistAwardsDetailData(year, awards) {
  const { data, error } = await supabase
    .from('shortlist')
    .select('*')
    .eq('year', year)
    .eq('awards', awards)

  if (error) {
    console.error('Error fetching shortlist data:', error);
    throw error;
  }
  return data;
}

// views/FavoriteView.vue 根據 localStorage 的資料去資料庫獲取資料
// SELECT * FROM shortlist WHERE id IN (${parms.join(', ')})
export async function fetchShortlistByIds(parms){
  const { data, error } = await supabase
    .from('shortlist')
    .select('*')
    .in('id', parms);

  if (error) {
    console.error('Error fetching shortlist data:', error);
    throw error;
  }
  return data;
}

/* /search 獲獎次數排行資料
 * view wonlist AS:
 * SELECT nominee, MIN(url) AS "url", COUNT(CASE WHEN won = 1 THEN 1 END) AS "won", COUNT(*) AS "nomineeTime"
 * FROM shortlist
 * GROUP BY nominee
 * HAVING COUNT(CASE WHEN won = 1 THEN 1 END) > 0
 * ORDER BY won DESC;
*/
export async function fetchWonList(){
  const { data, error } = await supabase.from("wonlist").select("*");

  if (error) {
    console.error('Error fetching shortlist wonlist:', error);
    throw error;
  }
  return data;
}

// 搜尋頁的搜尋功能
export async function searchShortlist(parms){
  const { data, error } = await supabase
    .from('shortlist')
    .select('*')
    .or(`work.ilike.%${parms}%,nominee.ilike.%${parms}%,awards.ilike.%${parms}%`);

  if (error) {
    console.error('Error fetching shortlist wonlist:', error);
    throw error;
  }
  return data;
}

// 試聽功能 取得作品的 kkbox_id
export async function getKKBOX_id(work, nominee, awards){
  const { data, error } = await supabase
    .from('shortlist')
    .select('kkbox_id')
    .eq('work', work)
    .eq('nominee', nominee)
    .eq('awards', awards)

  if (error) {
    console.error('Error fetching shortlist getKKBOX_id:', error);
    throw error;
  }
  return data;
}