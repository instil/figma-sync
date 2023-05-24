import * as target from "./CopySassHelper";
import {readFileSync, writeFileSync} from "fs";

jest.mock("fs");

const readFileSyncMock = jest.mocked(readFileSync);
const writeFileSyncMock = jest.mocked(writeFileSync);

beforeEach(() => {
  readFileSyncMock.mockReturnValue("a file with something in it");
});

it("should copy the desired sass file without modifications", () => {
  target.copySassHelper("some/path/to/original/helpers/file", "some/path/to/destination", "SpacerHelpers.scss");

  expect(writeFileSyncMock).toHaveBeenCalledWith("some/path/to/destination/SpacerHelpers.scss", "a file with something in it");
});

it("should copy the desired sass file with some modifications", () => {
  target.copySassHelper("some/path/to/original/helpers/file", "some/path/to/destination", "SpacerHelpers.scss", {
    replace: {
      match: "something",
      with: "something else"
    }
  });

  expect(writeFileSyncMock).toHaveBeenCalledWith("some/path/to/destination/SpacerHelpers.scss", "a file with something else in it");
});
