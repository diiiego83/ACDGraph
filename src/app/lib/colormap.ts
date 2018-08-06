const KCmapSize = 256;

export interface Color {
  red: number;
  green: number;
  blue: number;
}

export enum CMapModel {
  RED,
  BLACKWHITE,
  JET,
  GREEN,
  REDBLUE,
  REDGRAY,
  RGB
}

export interface ColorPoint {
  color: Color;
  pos: number; // Position in % from 0 to 100
}

export class ColorMap {

  public static create(model: CMapModel): number[] {

    const cmap: number[] = [KCmapSize];
    if (model === CMapModel.RED) {
      for (let j = 0; j < KCmapSize; j++) {
        cmap[j] = 0xff000000 | (j << 8) | 255;
      }
    } else if (model === CMapModel.BLACKWHITE) {
      for (let j = 0; j < 256; j++) {
        cmap[j] = 0xff000000 | (j << 16) | (j << 8) | (j);
      }
    } else if (model === CMapModel.JET) {
      for (let j = 0; j < 32; j++) {
        cmap[j] = 0xff000000 | (131 + j * 4);
      }
      for (let j = 32; j < 96; j++) {
        cmap[j] = 0xff000000 | (((j - 31) * 4 - 1) << 8) | (255);
      }
      for (let j = 96; j < 160; j++) {
        cmap[j] = 0xff000000 | (((j - 95) * 4 - 1) << 16) | (255 << 8) | (255 - (j - 95) * 4 + 1);
      }
      for (let j = 160; j < 224; j++) {
        cmap[j] = 0xff000000 | (255 << 16) | ((255 - (j - 159) * 4 + 1) << 8);
      }
      for (let j = 224; j < 256; j++) {
        cmap[j] = 0xff000000 | ((255 - (j - 223) * 4 + 1) << 16);
      }
    } else if (model === CMapModel.GREEN) {
      for (let j = 0; j < 256; j++) {
        cmap[j] = 0xff000000 + (0 << 16) | (j << 8) | (255 - j);
      }
    } else if (model === CMapModel.REDBLUE) {
      for (let j = 0; j < 128; j++) {
        cmap[j] = 0xff000000 | ((j * 2) << 16) | ((j * 2) << 8) | 255;
      }
      for (let j = 128; j < 256; j++) {
        cmap[j] = 0xff000000 + (255 << 16) | ((255 - (j - 128) * 2) << 8) | 255 - (j - 128) * 2;
      }
      cmap[127] = 0xffffffff;
    } else if (model === CMapModel.REDGRAY) {
      for (let j = 0; j < 128; j++) {
        cmap[j] = 0xff000000 | ((j * 2) << 16) | ((j * 2) << 8) | (j * 2);
      }
      for (let j = 128; j < 256; j++) {
        cmap[j] = 0xff000000 | (255 << 16) | ((255 - (j - 128) * 2) << 8) | 0;
      }
      cmap[127] = 0xffffffff;
    } else if (model === CMapModel.RGB) {
      for (let j = 0; j < 128; j++) {
        cmap[j] = 0xff000000 | ((255 - j) << 16) | ((j * 2) << 8) | (j);
      }
      for (let j = 128; j < 256; j++) {
        cmap[j] = 0xff000000 | ((255 - j) << 16) | ((255 - ((j - 128) * 2)) << 8) | (j);
      }
    } else {
      for (let ii = 0; ii < KCmapSize; ii++) {
        cmap[ii] = 0x00;
      }
    }
    return cmap;
  }

  public static custom(pts: ColorPoint[]) {
    return this.generate(pts[0].color, pts[1].color);
  }

  private static generate(p1: Color, p2: Color): number[] {

    const step = 1.0 / KCmapSize;
    const d0 = p2.red - p1.red;
    const d1 = p2.green - p1.green;
    const d2 = p2.blue - p1.blue;

    let inc = 0;
    const cmap: number[] = [KCmapSize];
    for (let ii = 0; ii < KCmapSize; ii++) {
      cmap[ii] =
        0xff000000 | // alpha (0xff==(255<<24)
        ((p1.blue + d2 * inc) << 16) |
        ((p1.green + d1 * inc) << 8) |
        (p1.red + d0 * inc);
      inc = inc + step;
    }

    return cmap;
  }

}
