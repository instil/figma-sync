import * as target from "./CopyHelperFile";
import {readFileSync, writeFileSync} from "fs";

jest.mock("fs");

const readFileSyncMock = jest.mocked(readFileSync);
const writeFileSyncMock = jest.mocked(writeFileSync);

beforeEach(() => {
  readFileSyncMock.mockReturnValue("a file with something in it");
});

it("should copy the desired scss file without modifications", () => {
  target.copyHelperFile("some/path/to/original/helpers/file", "some/path/to/destination", "SpacerHelpers.scss");

  expect(writeFileSyncMock).toHaveBeenCalledWith("some/path/to/destination/SpacerHelpers.scss", "a file with something in it");
});

it("should copy the desired scss file with some modifications", () => {
  target.copyHelperFile("some/path/to/original/helpers/file", "some/path/to/destination", "SpacerHelpers.scss", {
    replace: {
      match: "something",
      with: "something else"
    }
  });

  expect(writeFileSyncMock).toHaveBeenCalledWith("some/path/to/destination/SpacerHelpers.scss", "a file with something else in it");
});
