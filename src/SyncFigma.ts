import {getDesignToken} from "./loading/figma/GetDesignToken";
import {compileFigmaTokens} from "./saving/CompileFigmaTokens";
import {saveIcons} from "./saving/SaveIcons";
import {getIcons} from "./loading/figma/GetIcons";
import {loadConfig} from "@src/config/providers/Config";

interface Configuration {
  withIcons?: true;
}

export async function syncFigma(configuration?: Configuration): Promise<void> {
  await loadConfig();

  await syncDesignTokens();

  if (configuration?.withIcons) await syncIcons();
}

async function syncDesignTokens(): Promise<void> {
  console.log("Downloading design token...");
  const token = await getDesignToken();
  console.log("Design token download complete!\n");

  console.log("Compiling design token into styles...");
  compileFigmaTokens(token);
  console.log("Style compiling complete!\n");
}

async function syncIcons(): Promise<void> {
  console.log("Downloading icons...");
  const icons = await getIcons();
  console.log("Icon download complete!\n");

  console.log("Saving icons...");
  saveIcons(icons);
  console.log("Icon saving complete!\n");
}
