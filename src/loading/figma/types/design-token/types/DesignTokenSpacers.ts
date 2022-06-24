export interface DesignTokenSpacers {
  [key: string]: DesignTokenSpacer;
}

interface DesignTokenSpacer {
  value: string;
  type: "spacers";
}
