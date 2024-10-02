import {join, sep as separator} from "path";
import type {DesignToken} from "@src/shared/types/design-token/DesignToken";
import {outputFolder} from "@src/config/providers/Config";
import {writeFileSync} from "fs";
import {tokensToEntries} from "@src/saving/platforms/shared/utils/TokensToEntries";

export function saveAndroidStyleDictionary(tokens: DesignToken): void {
  const outputDirectory = join(outputFolder(), "android", separator);

  const colours = tokensToEntries(tokens.colors)
    .map(([key, colour]) => {
      const colourValue = colour.value
        .replace(/rgba\(/, "")
        .replace(/\)$/, "");

      return `val ${key} = Color(${colourValue})`;
    });
  const typography = tokensToEntries(tokens.fonts)
    .map(([key, font]) => {
      return `
        val ${key}Size: TextUnit = ${pxToSp(font.size.value)}
        val ${key}Weight: FontWeight = ${toKotlinWeight(font.weight.value)}
        val ${key}LineHeight: TextUnit = ${pxToSp(font.size.value)}
        fun ${key}(fontFamily: FontFamily) = TextStyle(
            fontFamily = fontFamily,
            fontSize = ${key}Size,
            fontWeight = ${key}Weight,
            lineHeight = ${key}LineHeight
        )
      `;
    });

  writeFileSync(join(outputDirectory, "FigmaTokens.kt"), `
    package co.instil.figmasync;
    
    import androidx.compose.ui.text.TextStyle
    import androidx.compose.ui.text.font.FontFamily
    import androidx.compose.ui.text.font.FontWeight
    import androidx.compose.ui.unit.TextUnit
    import androidx.compose.ui.unit.sp
    import androidx.compose.ui.graphics.Color

    ${colours.join("\n")}
    
    ${typography.join("")}
  `);
}

function toKotlinWeight(weight: number): string {
  return `FontWeight.W${weight}`;
}

function pxToSp(pxValue: string): string {
  return pxValue.replace("px", ".sp");
}
