import {outputFolder, spacersConfig} from "@src/config/providers/Config";
import {copyHelperFile} from "@src/saving/platforms/scss/scss-helpers/utils/CopyHelperFile";
import {join} from "path";
import {getHelpersFolderPath} from "@src/saving/platforms/scss/scss-helpers/utils/GetHelpersFolderPath";

export function saveScssHelpers(): void {
  const scssHelpersPath = getHelpersFolderPath("scss-helpers");
  const outputPath = join(outputFolder(), "scss");
  copyHelperFile(scssHelpersPath, outputPath, "TypographyHelpers.scss");
  copyHelperFile(scssHelpersPath, outputPath, "ColorHelpers.scss");
  copyHelperFile(scssHelpersPath, outputPath, "SpacerHelpers.scss", {
    replace: {
      match: "$gridSize: 4px;",
      with: `$gridSize: ${spacersConfig()?.gridSize ?? 4}px;`
    }
  });
}
