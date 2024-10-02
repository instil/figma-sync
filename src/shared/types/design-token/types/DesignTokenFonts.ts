import type {DesignToken} from "style-dictionary/types/DesignToken";
import type {PixelUnitType, UnitType} from "@src/shared/types/UnitType";

export interface DesignTokenFonts {
  [key: string]: DesignTokenFont;
}

export interface DesignTokenFont {
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
  value: PixelUnitType | string;
  type: "typography";
}

interface DesignTokenFontWeight extends Pick<DesignToken, "attributes"> {
  value: number;
  type: "typography";
}

interface DesignTokenFontLineHeight extends Pick<DesignToken, "attributes"> {
  value: UnitType;
  type: "typography";
}

interface DesignTokenFontSpacing extends Pick<DesignToken, "attributes"> {
  value: UnitType | "normal";
  type: "typography";
}