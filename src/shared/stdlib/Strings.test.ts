import * as target from "./Strings";

it("should remove whitespace from a string", () => {
  const result = target.removeWhitespace("a string with whitespace");

  expect(result).toBe("astringwithwhitespace");
});
