// 把登入的 SHA-256(token_id) 跟管理者的比對 
export async function verifySignIn() {
  let access_token_id = localStorage.getItem("access_token_id");
  const UID = await sha256(access_token_id);
  if (UID === import.meta.env.VITE_SUPABASE_SHA256_UID) {
    return "/admin"
  } else {
    return "/login"
  }
}
export async function signOut() {
  localStorage.setItem("access_token_id", "");
  return "/login"
}

// 模擬加密
async function sha256(message) {
  // 將字符串轉換為 ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  // 使用 SubtleCrypto 計算 SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // 將結果轉換為十六進制字符串
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}