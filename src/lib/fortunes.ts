export const FORTUNES: string[] = [
  "오늘의 운세: 애매하게 좋음. 근데 그거면 충분하잖아요?",
  "지갑은 닫고 마음은 여는 하루. 반대로 하면 통장이 웁니다.",
  "고민 중인 그거, 그냥 하세요. 안 하면 내일 또 고민할 거잖아요.",
  "오늘 당신의 촉은 정확합니다. 단, 배고플 때 내린 결정은 예외예요.",
  "누군가 당신을 오해할 수 있어요. 굳이 풀지 마세요, 시간이 알아서 정리합니다.",
  "커피 한 잔의 여유가 필요한 날. 두 잔은 심박수의 여유를 앗아갑니다.",
  "작은 실수는 귀엽게 넘어가는 하루. 큰 실수는… 오늘은 안 할 예정이죠?",
  "예상 밖의 지출 주의. 장바구니는 저장만 하고 결제는 내일의 당신에게.",
  "오늘 웃을 일이 생겨요. 아마 당신이 만든 상황일 확률이 높지만요.",
  "미뤄둔 일이 당신을 부릅니다. 못 들은 척해도 괜찮아요, 내일도 부를 테니까.",
  "낯선 시도가 뜻밖의 재미를 줍니다. 실패해도 이야깃거리 하나 건지는 거고요.",
  "오늘은 고집부려도 되는 날. 단, 길 안내 앱한테는 지는 게 이깁니다.",
  "연락 끊겼던 사람에게서 소식이 올 수 있어요. 놀란 척은 미리 준비해두세요.",
  "정리정돈을 하면 잃어버린 물건이 나옵니다. 그리고 또 사려던 이유도 사라지죠.",
  "오늘의 당신은 은근히 인기 많음. 이유는 묻지 말고 그냥 누리세요.",
  "무리하지 않는 게 오늘의 미덕. 소파와 한 몸이 되는 것도 자기관리입니다.",
  "미루던 결정, 오늘 답이 보여요. 사실 답은 처음부터 알고 있었죠?",
  "행운은 준비된 자에게 온다지만, 오늘은 그냥 와요. 편하게 받으세요.",
  "누군가의 칭찬에 어색해하지 마세요. 맞는 말이니까요.",
  "계획대로 안 돼도 괜찮은 하루. 원래 좋은 이야기엔 반전이 있는 법이잖아요.",
];

export const LUCKY_ITEMS: string[] = [
  "우산",
  "손거울",
  "노란 볼펜",
  "동전 지갑",
  "귀여운 스티커",
  "머그컵",
  "향긋한 핸드크림",
  "네잎클로버 열쇠고리",
  "줄무늬 양말",
  "따뜻한 목도리",
  "포스트잇",
  "이어폰",
  "책갈피",
  "작은 화분",
  "캔디",
  "손편지",
  "안경닦이",
  "체크무늬 손수건",
  "동그란 단추",
  "별 모양 배지",
];

export const LUCKY_COLORS: string[] = [
  "하늘색",
  "노란색",
  "연분홍색",
  "민트색",
  "보라색",
  "주황색",
  "초록색",
  "빨간색",
];

export const LUCKY_FOODS: string[] = [
  "떡볶이",
  "김밥",
  "마라탕",
  "붕어빵",
  "아메리카노",
  "치즈케이크",
  "삼겹살",
  "호떡",
  "곱창",
  "약과",
  "귤",
  "라면",
  "카레",
  "만두",
  "딸기",
  "국밥",
  "탕후루",
  "크로플",
  "닭강정",
  "순대",
];

export type FortuneResult = {
  fortune: string;
  item: string;
  color: string;
  food: string;
  lotto: number[];
};

function pickRandom<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function drawLotto(): number[] {
  const numbers = new Set<number>();
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

export function drawFortune(): FortuneResult {
  return {
    fortune: pickRandom(FORTUNES),
    item: pickRandom(LUCKY_ITEMS),
    color: pickRandom(LUCKY_COLORS),
    food: pickRandom(LUCKY_FOODS),
    lotto: drawLotto(),
  };
}
