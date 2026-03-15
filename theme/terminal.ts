export const terminal = {
  colors: {
    // phosphor green family
    primary: "#39FF14", // bright green — active elements, cursor
    primaryDim: "#00CC00", // normal text
    primaryMuted: "#006600", // secondary text, borders
    primaryGhost: "#002200", // background tint, disabled

    // backgrounds
    bg: "#0A0A0A", // near-black screen bg
    bgRaised: "#0F1A0F", // cards, input fields
    bgOverlay: "#0D150D", // modal overlays

    // status colors (still terminal-flavored)
    danger: "#FF4444", // errors, warnings
    dangerDim: "#AA0000",
    warning: "#FFAA00", // caution states
    success: "#39FF14", // same as primary

    // text
    textPrimary: "#39FF14",
    textSecondary: "#00CC00",
    textMuted: "#006600",
    textInverse: "#0A0A0A", // text on bright bg
  },

  fonts: {
    mono: "ShareTechMono", // load via expo-font
    size: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 20,
      xxl: 28,
      display: 36,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.6,
      loose: 2.0, // terminal logs feel spacious
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // ASCII box drawing for borders
  borders: {
    single: { h: "─", v: "│", tl: "┌", tr: "┐", bl: "└", br: "┘" },
    double: { h: "═", v: "║", tl: "╔", tr: "╗", bl: "╚", br: "╝" },
    heavy: { h: "━", v: "┃", tl: "┏", tr: "┓", bl: "┗", br: "┛" },
  },
};

export type TerminalTheme = typeof terminal;
