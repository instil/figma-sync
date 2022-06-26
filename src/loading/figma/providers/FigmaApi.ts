import {Api as FigmaApi} from "figma-api/lib/api-class";
import {figmaApiKey} from "@src/config/providers/Config";

export const figmaApi = (): FigmaApi => new FigmaApi({
  personalAccessToken: figmaApiKey()
});
