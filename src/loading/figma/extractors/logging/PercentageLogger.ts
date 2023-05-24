interface Props {
  type: Type;
  index: number;
  length: number;
  extra?: string;
}

type Type =
  | "fonts"
  | "styles"
  | "icons";

export function logPercentage({type, index, length, extra}: Props): void {
  console.log(`Extracting ${type}: ${Math.round(((index + 1) / length) * 100)}%${extra ? ` ${extra}` : ""}`);
}
