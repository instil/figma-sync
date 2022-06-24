export interface DesignTokenColors {
  [key: string]: DesignTokenColor;
}

interface DesignTokenColor {
  value: `rgba(${number}, ${number}, ${number}, ${number})`;
  type: "color";
}
