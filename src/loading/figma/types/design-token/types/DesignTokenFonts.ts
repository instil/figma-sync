import type {DesignToken} from "style-dictionary/types/DesignToken";

export interface DesignTokenFonts {
  [key: string]: DesignTokenFont;
}

interface DesignTokenFont {
  family: DesignTokenFontFamily;
  size: DesignTokenFontSize;
  weight: DesignTokenFontWeight;
  lineheight: DesignTokenFontLineHeight;
  spacing: DesignTokenFontSpacing;
}

interface DesignTokenFontFamily extends Pick<DesignToken, "attributes"> {
  value: string | `${string}, ${string}`;
  type: "typography";
}

interface DesignTokenFontSize extends Pick<DesignToken, "attributes"> {
  value: `${number}px` | string;
  type: "typography";
}

interface DesignTokenFontWeight extends Pick<DesignToken, "attributes"> {
  value: number;
  type: "typography";
}

interface DesignTokenFontLineHeight extends Pick<DesignToken, "attributes"> {
  value: `${number}px` | `${number}rem`;
  type: "typography";
}

interface DesignTokenFontSpacing extends Pick<DesignToken, "attributes"> {
  value: `${number}px` | `${number}rem` | "normal";
  type: "typography";
}