import { supabase } from "./supabase";
import type { FortuneResult } from "./fortunes";

// 운세를 뽑을 때마다 Supabase에 한 줄씩 기록합니다.
// 테이블이 아직 없거나 네트워크 문제가 있어도 앱 동작은 막지 않습니다(조용히 실패).
export async function logDraw(result: FortuneResult): Promise<void> {
  try {
    const { error } = await supabase.from("fortune_draws").insert({
      fortune: result.fortune,
      item: result.item,
      color: result.color,
      lotto: result.lotto,
    });
    if (error) console.warn("운세 기록 실패:", error.message);
  } catch (err) {
    console.warn("운세 기록 중 예외:", err);
  }
}

// 지금까지 뽑은 총 운세 횟수를 가져옵니다. 실패하면 null 을 반환합니다.
export async function getDrawCount(): Promise<number | null> {
  try {
    const { count, error } = await supabase
      .from("fortune_draws")
      .select("*", { count: "exact", head: true });
    if (error) {
      console.warn("운세 횟수 조회 실패:", error.message);
      return null;
    }
    return count ?? 0;
  } catch (err) {
    console.warn("운세 횟수 조회 중 예외:", err);
    return null;
  }
}
