import { Buffer } from 'buffer';

export enum ENDIANITY {
  LITTLE_ENDIAN = 0,
  BIG_ENDIAN = 1
}

export class DataReader {

  static readfloat32(
    buffer: ArrayBuffer,
    endianity: ENDIANITY = ENDIANITY.LITTLE_ENDIAN): Float32Array {

        if (endianity === ENDIANITY.BIG_ENDIAN) {
          const buff = Buffer.from(buffer);
          const size = buffer.byteLength / 4;
          const data = new Float32Array(size);
          for (let ii = 0; ii < size; ii++) {
            data[ii] = buff.readFloatBE(ii * 4);
          }
          return data;
        } else {
          return new Float32Array(buffer, 0, buffer.byteLength / 4);
        }
    }
}
