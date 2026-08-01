import { NextResponse } from "next/server";

const MODEL = "openrouter/free";

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY 가 설정되지 않았어요." },
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
              "너는 따뜻하고 긍정적인 '오늘의 운세'를 지어주는 도우미야. " +
              "한국어로, 한두 문장의 짧고 다정한 운세를 만들어. " +
              "이모지나 따옴표 없이 운세 문장만 출력해.",
          },
          {
            role: "user",
            content: `${who}오늘의 운세를 새로 하나 지어줘.`,
          },
        ],
        temperature: 1.0,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("OpenRouter 오류:", res.status, detail);
      return NextResponse.json(
        { error: "AI 운세 생성에 실패했어요. 잠시 후 다시 시도해주세요." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const fortune: string | undefined = data?.choices?.[0]?.message?.content?.trim();
    if (!fortune) {
      return NextResponse.json(
        { error: "AI 응답을 읽지 못했어요." },
        { status: 502 }
      );
    }

    return NextResponse.json({ fortune });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "서버 오류가 발생했어요." },
      { status: 500 }
    );
  }
}
