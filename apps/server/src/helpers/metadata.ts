export const metadataArrayToObject = (
  metadata: Record<string, string>[],
  key: string
) => {
  return metadata
    .map((v) => {
      const keyValue = Object.keys(v).find((k) => k !== 'value');
      const keyName = v[keyValue!].toLowerCase().replace(' ', '-');
      return {
        key: `${key}:${keyName}`,
        value: v.value,
      };
    })
    .reduce(
      (acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      },
      {} as Record<string, string>
    );
};
