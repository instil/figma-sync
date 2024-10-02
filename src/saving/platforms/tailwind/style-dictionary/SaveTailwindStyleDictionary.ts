import {join, sep as separator} from "path";
import {writeFileSync} from "fs";
import type {DesignToken} from "@src/shared/types/design-token/DesignToken";
import {outputFolder} from "@src/config/providers/Config";
import {toTailwindCss} from "@src/saving/platforms/tailwind/style-dictionary/custom-transform/ToTailwindCss";
import {toTailwindColourConfig} from "@src/saving/platforms/tailwind/style-dictionary/custom-transform/ToTailwindColourConfig";

export function saveTailwindStyleDictionary(tokens: DesignToken): void {
  const buildPath = join(outputFolder(), "tailwind", separator);

  generateTailwindColourConfig(buildPath, tokens);
  generateTypographyCss(buildPath, tokens);
}

function generateTailwindColourConfig(buildPath: string, tokens: DesignToken): void {
  const asTailwindConfig = toTailwindColourConfig(tokens.colors);
  writeFileSync(join(buildPath, "_colors.ts"), asTailwindConfig);
}

function generateTypographyCss(buildPath: string, tokens: DesignToken): void {
  const asTailwindCss = toTailwindCss(tokens.fonts);
  writeFileSync(join(buildPath, "_typography.css"), asTailwindCss);
}
