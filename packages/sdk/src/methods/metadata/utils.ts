export interface Metadata {
  key: string;
  value: string;
}

/**
 * Converts an array of ASCII bytes to a string.
 *
 * @param {number[]} bytes - The array of ASCII bytes to convert.
 * @returns {string} - The resulting string.
 */
export const strBytesAscii = (bytes: number[]) =>
  bytes.map((a) => String.fromCharCode(a)).join('');

/**
 * Converts an array of bytes to a number.
 *
 * @param {Array<number>} byteArray - The array of bytes to convert, must contain exactly 2 bytes.
 *
 * @return {number} The converted number.
 *
 * @throws {Error} Thrown if the array does not contain exactly 2 bytes.
 */
export function bytesToNumber(byteArray: number[]) {
  if (byteArray.length !== 2) {
    throw new Error('Array must contain exactly 2 bytes');
  }
  return (byteArray[0] << 8) + byteArray[1];
}

/**
 * Decodes metadata from an array of bytes.
 *
 * @param {number[]} bytes - The array of bytes containing the metadata.
 * @returns {Metadata[]} - An array of Metadata objects representing the decoded metadata.
 */
export function decodeMetadata(bytes: number[]) {
  const metdata: Metadata[] = [];

  /**
   * Decodes an array of bytes based on a given index.
   *
   * @param _bytes The array of bytes to decode.
   * @param index The index to start decoding from.
   * @return An array containing the decoded value and the new index.
   */
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
