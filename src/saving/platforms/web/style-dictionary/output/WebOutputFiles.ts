import {colorsConfig} from "@src/config/providers/Config";
import type {File} from "style-dictionary/types/File";

const defaultOutputFiles: File[] = [
  {
    destination: "_colors.scss",
    format: "scss/map-deep",
    filter: {
      type: "color"
    }
  },
  {
    destination: "_typography.scss",
    format: "scss/map-deep",
    filter: {
      type: "typography"
    }
  }
];

const cssVariablesConfig: File = {
  destination: "_colors.variables.css",
  format: "css/variables",
  filter: {
    type: "color"
  }
};

export function webOutputFiles(): File[] {
  if (colorsConfig()?.includeCssVariables) {
    return [
      ...defaultOutputFiles,
      cssVariablesConfig
    ];
  }

  return defaultOutputFiles;
}