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