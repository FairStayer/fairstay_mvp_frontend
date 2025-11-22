import { Platform } from 'react-native';

const systemFont = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
});

export const typography = {
  /** -----------------------------
   *  🟦 헤더 / 큰 제목 (예: FairStay 상단)
   *  ----------------------------- */
  titleXL: {
    fontFamily: systemFont,
    fontSize: 26,
    letterSpacing: -0.02,
    fontWeight: '700',
  },

  /** -----------------------------
   *  🟩 일반 제목 (예: 섹션명, 카드 제목)
   *  ----------------------------- */
  titleL: {
    fontFamily: systemFont,
    fontSize: 20,
    letterSpacing: -0.02,
    fontWeight: '600',
  },
  titleM: {
    fontFamily: systemFont,
    fontSize: 17,
    letterSpacing: -0.02,
    fontWeight: '600',
  },

  /** -----------------------------
   *  🟨 본문 (예: 카드 설명, 날짜 등)
   *  ----------------------------- */
  bodyL: {
    fontFamily: systemFont,
    fontSize: 15,
    letterSpacing: -0.03,
    fontWeight: '400',
  },
  bodyS: {
    fontFamily: systemFont,
    fontSize: 13,
    letterSpacing: -0.03,
    fontWeight: '400',
  },

  /** -----------------------------
   *  🟧 라벨 및 상태표시 (예: “In Progress” 등)
   *  ----------------------------- */
  label: {
    fontFamily: systemFont,
    fontSize: 13,
    letterSpacing: -0.03,
    fontWeight: '600',
  },

  /** -----------------------------
   *  🟪 보조 텍스트 (예: 캡션, 설명)
   *  ----------------------------- */
  caption: {
    fontFamily: systemFont,
    fontSize: 12,
    letterSpacing: -0.03,
    fontWeight: '400',
  },
} as const;

export type TypographyVariant = keyof typeof typography;
