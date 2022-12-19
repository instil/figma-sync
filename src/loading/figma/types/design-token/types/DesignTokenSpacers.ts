import type {DesignToken} from "style-dictionary/types/DesignToken";

export interface DesignTokenSpacers {
  [key: string]: DesignTokenSpacer;
}

interface DesignTokenSpacer extends Pick<DesignToken, "attributes"> {
  value: string;
  type: "spacers";
}
