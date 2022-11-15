// eslint-disable-next-line
export function sortFields<ValueType>(input: Record<string, ValueType>, sortFunction = naturalAlphabeticalSort): Record<string, ValueType> {
  return Object.fromEntries(
    Object.entries(input).sort(sortFunction)
  );
}

// eslint-disable-next-line
function naturalAlphabeticalSort(entryA: [string, any], entryB: [string, any]): number {
  return entryA[0].localeCompare(entryB[0], undefined, {numeric: true, sensitivity: "base"});
}
