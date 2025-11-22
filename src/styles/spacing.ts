// src/styles/spacing.ts

export const spacing = {
  xs: 4,    // 아주 작은 간격 (아이콘, 텍스트 간격)
  s: 8,     // 소형 간격 (텍스트와 버튼, 카드 내부 여백)
  m: 16,    // 중간 간격 (카드 패딩, 섹션 내부 여백)
  l: 24,    // 대형 간격 (섹션 간 구분, 주요 블록 간)
  xl: 32,   // 아주 큰 간격 (스크린 상단/하단 마진)
  xxl: 48,  // 예외적으로 큰 간격 (Hero 영역 등)
} as const;

export type SpacingKey = keyof typeof spacing;
