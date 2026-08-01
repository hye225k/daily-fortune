import { NextResponse } from "next/server";

const MODEL = "openrouter/free";

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "키가 서버에 없어요 (OPENROUTER_API_KEY 미설정)." },
      { status: 500 }
    );
  }

  let name = "";
  try {
    const body = await request.json();
    name = typeof body?.name === "string" ? body.name.trim() : "";
  } catch {
    // 본문이 없어도 무시
  }
  const who = name ? `${name}님을 위한 ` : "";

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "너는 '오늘의 운세'를 위트 있게 지어주는 도우미야. " +
              "뻔한 덕담이나 교훈적인 말은 절대 금지. " +
              "한국어로 한두 문장, 가벼운 유머나 재치 있는 반전이 담긴 운세를 만들어. " +
              "부정적이거나 불쾌한 내용은 피하고, 이모지나 따옴표 없이 운세 문장만 출력해.",
          },
          {
            role: "user",
            content: `${who}오늘의 운세를 새로 하나 지어줘.`,
          },
        ],
        temperature: 1.0,
      }),
    });

    const raw = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        { error: `OpenRouter ${res.status}: ${raw.slice(0, 300)}` },
        { status: 502 }
      );
    }

    const data = JSON.parse(raw);
    const fortune: string | undefined = data?.choices?.[0]?.message?.content?.trim();
    if (!fortune) {
      return NextResponse.json(
        { error: `응답에 운세가 없어요: ${raw.slice(0, 300)}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ fortune });
  } catch (err) {
    return NextResponse.json(
      { error: `서버 예외: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}
