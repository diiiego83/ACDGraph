const KCmapSize = 256;

export interface Color {
  red: number;
  green: number;
  blue: number;
}

export enum CMapModel {
  RED = 0
}

export interface ColorPoint {
  color: Color;
  pos: number; // Position in % from 0 to 100
}

export class ColorMap {

  public static create(model: CMapModel): number[] {

    const cmap: number[] = [KCmapSize];
    if (model === CMapModel.RED) {
      for (let ii = 0; ii < KCmapSize; ii++) {
        cmap[ii] = 0xff000000 | (ii << 8) | 255;
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
