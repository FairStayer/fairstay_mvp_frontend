// src/styles/colors.ts
export const colors = {
  primary: '#0064FF',     // Proof Blue
  secondary: '#5F00D4',   // Contract Violet
  background: '#202632',  // Ledger Black
  surface: '#E6EAEF',     // Paper Gray
} as const;

export type ColorName = keyof typeof colors;
