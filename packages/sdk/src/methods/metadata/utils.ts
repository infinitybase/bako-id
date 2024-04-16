export interface Metadata {
  key: string;
  value: string;
}

export const strBytesAscii = (bytes: number[]) =>
  bytes.map((a) => String.fromCharCode(a)).join('');

export function bytesToNumber(byteArray: number[]) {
  if (byteArray.length !== 2) {
    throw new Error('Array must contain exactly 2 bytes');
  }
  return (byteArray[0] << 8) + byteArray[1];
}

export function decodeMetadata(bytes: number[]) {
  const metdata: Metadata[] = [];

  function decode(_bytes: number[], index: number) {
    const offset = index + 2;
    const size = bytesToNumber(_bytes.slice(index, offset));
    const value = _bytes.slice(offset, offset + size);
    return [strBytesAscii(value), offset + size] as const;
  }
  function _decodeMetadata(bytes: number[], index: number) {
    if (index >= bytes.length) return;
    const [key, offset] = decode(bytes, index);
    const [value, offset2] = decode(bytes, offset);
    metdata.push({ key, value });
    _decodeMetadata(bytes, offset2);
  }
  _decodeMetadata(bytes, 0);

  return metdata;
}
