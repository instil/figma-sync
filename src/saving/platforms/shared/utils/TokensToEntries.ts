type TokenEntry<TokenValue> = [string, TokenValue];

export function tokensToEntries<TokenValue>(tokenRecord: Record<string, TokenValue>): TokenEntry<TokenValue>[] {
  const entries = Object.entries(tokenRecord) as TokenEntry<TokenValue>[];

  return entries
    .map(([key, value]): TokenEntry<TokenValue> => {
      return [tokenKeyToCamelCase(key), value];
    })
    .filter(([keyToEnsureIsUnique], index, allEntries) => {
        return allEntries.findIndex(([iteratedKey]) => (iteratedKey === keyToEnsureIsUnique)) === index;
      }
    );
}

function tokenKeyToCamelCase(typographyKey: string): string {
  return typographyKey
    .replace(/\s/g, "")
    .replace(/\//g, "");
}