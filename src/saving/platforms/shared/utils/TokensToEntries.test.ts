import * as target from "./TokensToEntries";

it("should return entries with no duplicates from token", () => {
  const result = target.tokensToEntries({
    "Primary / Light / 10": "a colour value",
    "Primary/Light/10": "a colour value",
    "Desktop 2XL Regular": "a typography value"
  });

  expect(result).toEqual([
    ["PrimaryLight10", "a colour value"],
    ["Desktop2XLRegular", "a typography value"]
  ]);
});
