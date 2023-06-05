import type {SvgDictionary} from "@src/shared/types/design-token/SvgDictionary";
import {mkdirSync, writeFileSync} from "fs";
import {logPercentage} from "@src/shared/logging/PercentageLogger";
import {iconBuildFolder} from "@src/saving/providers/IconsDirectory";
import {join} from "path";

export function saveIcons(icons: SvgDictionary): void {
  console.log("Saving icons...");

  const iconDirectory = iconBuildFolder();
  mkdirSync(iconDirectory, {
    recursive: true
  });

  const entries = Object.entries(icons);
  entries.forEach(([key, value], index) => {
    logPercentage({
      type: "icons",
      index,
      length: entries.length
    });
    writeFileSync(join(iconDirectory, `${key}.svg`), value);
  });

  console.log("Icon saving complete!\n");
}
