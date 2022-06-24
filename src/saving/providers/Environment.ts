import {config} from "dotenv";
import {join} from "path";

config({
  path: join(process.cwd(), ".env.local")
});

export const generatedFilesDirectory = (): string => {
  const fromEnvironment = process.env.GENERATED_FILES_DIRECTORY as string;
  if (!fromEnvironment) throw Error(`Could not find environment variable 'GENERATED_FILES_DIRECTORY'. Please create '${process.cwd()}/.env.local' file and add 'GENERATED_FILES_DIRECTORY=<the directory you want to save to>'`);
  return fromEnvironment;
};
