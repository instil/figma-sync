import * as target from "./Arrays";

describe("when filtering undefined", () => {
  const arrayWithUndefined = [1, undefined, 2, undefined, "3"];
  let result: ReturnType<typeof target.filterUndefined>;

  beforeEach(() => {
    result = target.filterUndefined(arrayWithUndefined);
  });

  it("should return new array with undefined elements removed", () => {
    expect(result).toEqual([1, 2, "3"]);
  });

  it("should not modify original array", () => {
    expect(arrayWithUndefined).toEqual([1, undefined, 2, undefined, "3"]);
  });
});
