import * as target from "./Objects";

it("should sort the fields on an object via natural alphabetical sort", () => {
  const result = target.sortFields({
    c1: "value",
    c10: "value",
    c100: "value",
    c2: "value",
    c20: "value",
    c200: "value",
    b: "value",
    a: "value"
  });

  expect(result).toEqual({
    a: "value",
    b: "value",
    c100: "value",
    c10: "value",
    c1: "value",
    c200: "value",
    c20: "value",
    c2: "value"
  });
});

it("should sort the fields via custom sort function", () => {
  const result = target.sortFields(
    {
      a: "value",
      b: "value",
      c: "value"
    },
    (entryA, entryB) => {
      return entryB[0].localeCompare(entryA[0]);
    }
  );

  expect(result).toEqual({
    a: "value",
    b: "value",
    c: "value"
  });
});