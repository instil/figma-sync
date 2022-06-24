import {config} from "dotenv";
import {join} from "path";

config({
  path: join(process.cwd(), ".env.local")
});

export const figmaId = (): string => {
  const fromEnvironment = process.env.FIGMA_ID as string;
  if (!fromEnvironment) throw Error(`Could not find environment variable 'FIGMA_ID'. Please create '${process.cwd()}/.env.local' file and add 'FIGMA_ID=<your figma file id>'`);
  return fromEnvironment;
};

export const figmaApiKey = (): string => {
  const fromEnvironment = process.env.FIGMA_API_KEY as string;
  if (!fromEnvironment) throw Error(`Could not find environment variable 'FIGMA_API_KEY'. Please create '${process.cwd()}/.env.local' file and add 'FIGMA_API_KEY=<your figma api key>'`);
  return fromEnvironment;
};
