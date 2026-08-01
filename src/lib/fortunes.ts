export const FORTUNES: string[] = [
  "오늘은 생각지도 못한 곳에서 좋은 소식이 들려올 거예요.",
  "작은 용기가 큰 행운을 불러오는 하루입니다.",
  "주변 사람과의 대화 속에 힌트가 숨어 있어요.",
  "미뤄뒀던 일을 시작하기에 더없이 좋은 날이에요.",
  "예상치 못한 지출을 조심하면 무난히 넘어가는 하루예요.",
  "오늘 내린 결정이 앞으로 큰 도움이 될 거예요.",
  "몸과 마음을 쉬게 하면 내일이 더 가벼워져요.",
  "새로운 인연이 찾아올 수 있으니 마음을 열어보세요.",
  "노력한 만큼 결과가 따라오는 날입니다.",
  "가벼운 산책이 오늘의 운을 끌어올려 줘요.",
  "고민하던 문제의 실마리가 오늘 풀릴 것 같아요.",
  "칭찬 한마디가 하루를 특별하게 만들어요.",
  "조급해하지 않으면 모든 일이 순조롭게 풀려요.",
  "뜻밖의 선물 같은 순간이 기다리고 있어요.",
  "평소보다 조금 더 웃으면 행운이 따라와요.",
  "낯선 시도가 뜻밖의 즐거움을 줄 거예요.",
  "정리정돈을 하면 마음까지 맑아지는 하루예요.",
  "오랜만에 연락한 사람에게서 반가운 소식이 와요.",
  "오늘은 자신을 믿고 밀어붙여도 좋은 날이에요.",
  "작은 실수는 있어도 결국엔 잘 마무리돼요.",
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

export type FortuneResult = {
  fortune: string;
  item: string;
  color: string;
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
    lotto: drawLotto(),
  };
}
