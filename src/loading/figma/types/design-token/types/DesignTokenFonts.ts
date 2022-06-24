export interface DesignTokenFonts {
  [key: string]: DesignTokenFont;
}

interface DesignTokenFont {
  family: {
    value: string | `${string}, ${string}`;
    type: "typography";
  };
  size: {
    value: `${number}px` | string;
    type: "typography";
  };
  weight: {
    value: number;
    type: "typography";
  };
  lineheight: {
    value: `${number}px`;
    type: "typography";
  };
  spacing: {
    value: `${number}px` | "normal";
    type: "typography";
  };
}
