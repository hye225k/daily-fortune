import { supabase } from "./supabase";

// 운세를 뽑을 때마다 fortunes 테이블에 한 줄씩 저장합니다.
// name 은 선택값(비어 있으면 null). date 는 DB에서 current_date 로 자동 채워집니다.
// 테이블이 없거나 네트워크 문제가 있어도 앱 동작은 막지 않습니다(조용히 실패).
export async function saveFortune(
  name: string,
  fortune: string
): Promise<void> {
  try {
    const { error } = await supabase.from("fortunes").insert({
      name: name.trim() || null,
      fortune,
    });
    if (error) console.warn("운세 저장 실패:", error.message);
  } catch (err) {
    console.warn("운세 저장 중 예외:", err);
  }
}

// 지금까지 저장된 총 운세 개수를 가져옵니다. 실패하면 null 을 반환합니다.
export async function getFortuneCount(): Promise<number | null> {
  try {
    const { count, error } = await supabase
      .from("fortunes")
      .select("*", { count: "exact", head: true });
    if (error) {
      console.warn("운세 개수 조회 실패:", error.message);
      return null;
    }
    return count ?? 0;
  } catch (err) {
    console.warn("운세 개수 조회 중 예외:", err);
    return null;
  }
}
