import {readFileSync, writeFileSync, existsSync} from "fs";
import {outputFolder} from "@src/config/providers/Config";

const typographyHelperPath = `${__dirname}/../../scss-helpers/TypographyHelpers.scss`

export function saveSassHelpers(): void {
  if (!existsSync(typographyHelperPath)) throw Error("Could not find typography helper file");

  writeFileSync(`${outputFolder()}/scss/TypographyHelpers.scss`, readFileSync(typographyHelperPath))
}
