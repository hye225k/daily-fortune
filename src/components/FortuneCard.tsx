"use client";

import { useEffect, useState } from "react";
import { drawFortune, type FortuneResult } from "@/lib/fortunes";
import { saveFortune, getFortuneCount } from "@/lib/draws";

// 로또 번호 6개에 각각 다른 색을 입힙니다.
const LOTTO_COLORS = [
  "bg-rose-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-fuchsia-500",
];

export default function FortuneCard() {
  const [flipped, setFlipped] = useState(false);
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [name, setName] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 첫 렌더 시 지금까지 저장된 운세 개수를 Supabase에서 가져옵니다.
  useEffect(() => {
    getFortuneCount().then(setCount);
  }, []);

  function recordDraw(next: FortuneResult) {
    setResult(next);
    // fortunes 테이블에 자동 저장(실패해도 무시)하고, 카운터는 낙관적으로 +1
    saveFortune(name, next.fortune);
    setCount((c) => (c === null ? c : c + 1));
  }

  function handleDraw() {
    if (isDrawing) return;

    if (flipped) {
      // reset to front, then draw again after the flip-back finishes
      setIsDrawing(true);
      setFlipped(false);
      window.setTimeout(() => {
        recordDraw(drawFortune());
        setFlipped(true);
        setIsDrawing(false);
      }, 400);
      return;
    }

    recordDraw(drawFortune());
    setFlipped(true);
  }

  // 버튼을 누르면 서버(/api/fortune)를 통해 AI가 운세를 새로 만들어 줍니다.
  async function handleAIDraw() {
    if (isDrawing || aiLoading) return;
    setError(null);
    setAiLoading(true);
    try {
      const res = await fetch("/api/fortune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok || !data.fortune) {
        throw new Error(data.error || "AI 운세 생성에 실패했어요.");
      }
      // AI가 만든 운세 문장에, 기존 방식의 행운 아이템/색/음식/로또를 합칩니다.
      const aiResult: FortuneResult = { ...drawFortune(), fortune: data.fortune };

      if (flipped) {
        setFlipped(false);
        await new Promise((r) => setTimeout(r, 400));
      }
      recordDraw(aiResult);
      setFlipped(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "문제가 발생했어요.");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름 (선택)"
        maxLength={20}
        className="w-56 rounded-full border border-neutral-300 bg-white/80 px-4 py-2 text-center text-sm text-neutral-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200 sm:w-64 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-100"
      />

      <div className="[perspective:1200px]">
        <div
          className={`relative h-[26rem] w-64 transition-transform duration-700 ease-out [transform-style:preserve-3d] sm:h-[30rem] sm:w-72 ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front face */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-100 to-orange-200 shadow-xl [backface-visibility:hidden] dark:border-amber-900 dark:from-amber-950 dark:to-orange-950">
            <span className="text-6xl">🔮</span>
            <p className="text-lg font-semibold text-amber-900 dark:text-amber-100">
              오늘의 운세
            </p>
            <p className="text-sm text-amber-700/80 dark:text-amber-300/70">
              카드를 눌러 확인하세요
            </p>
          </div>

          {/* Back face */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-100 to-indigo-200 p-6 text-center shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)] dark:border-violet-900 dark:from-violet-950 dark:to-indigo-950">
            <span className="text-4xl">✨</span>
            <p className="text-base font-medium leading-relaxed text-violet-950 dark:text-violet-100">
              {result?.fortune}
            </p>
            <div className="mt-1 flex flex-col gap-1 text-sm text-violet-800 dark:text-violet-300">
              <p>
                🍀 행운의 아이템 <span className="font-semibold">{result?.item}</span>
              </p>
              <p>
                🎨 행운의 색 <span className="font-semibold">{result?.color}</span>
              </p>
              <p>
                🍽️ 행운의 음식 <span className="font-semibold">{result?.food}</span>
              </p>
            </div>
            <div className="mt-1 flex flex-col items-center gap-2">
              <p className="text-sm text-violet-800 dark:text-violet-300">
                🎱 행운의 로또 번호
              </p>
              <div className="grid grid-cols-3 gap-2">
                {result?.lotto.map((n, i) => (
                  <span
                    key={n}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white shadow ${
                      LOTTO_COLORS[i % LOTTO_COLORS.length]
