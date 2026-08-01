"use client";

import { useEffect, useState } from "react";
import { drawFortune, type FortuneResult } from "@/lib/fortunes";
import { saveFortune, getFortuneCount } from "@/lib/draws";

export default function FortuneCard() {
  const [flipped, setFlipped] = useState(false);
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [name, setName] = useState("");
  const [count, setCount] = useState<number | null>(null);

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
          className={`relative h-80 w-56 transition-transform duration-700 ease-out [transform-style:preserve-3d] sm:h-96 sm:w-64 ${
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
            </div>
            <div className="mt-1 flex flex-col items-center gap-2">
              <p className="text-sm text-violet-800 dark:text-violet-300">
                🎱 행운의 로또 번호
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {result?.lotto.map((n) => (
                  <span
                    key={n}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white shadow dark:bg-violet-500"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleDraw}
        disabled={isDrawing}
        className="rounded-full bg-violet-600 px-8 py-3 text-base font-semibold text-white shadow-md transition hover:bg-violet-700 active:scale-95 disabled:opacity-60"
      >
        {flipped ? "다시 뽑기" : "운세 보기"}
      </button>

      {count !== null && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          지금까지 뽑은 운세{" "}
          <span className="font-semibold text-violet-600 dark:text-violet-400">
            {count.toLocaleString()}
          </span>
          번
        </p>
      )}
    </div>
  );
}
