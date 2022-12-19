import type {DesignToken} from "style-dictionary/types/DesignToken";

export interface DesignTokenColors {
  [key: string]: DesignTokenColor;
}

interface DesignTokenColor extends Pick<DesignToken, "attributes"> {
  value: `rgba(${number}, ${number}, ${number}, ${number})`;
  type: "color";
}
