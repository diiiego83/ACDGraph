const KCmapSize = 256;

export enum ColorMapModel {
  GRAY = 0,
  JET = 1,
  HSV = 2,
  HOT = 3,
  COOL = 4,
  SPRING = 5,
  SUMMER = 6,
  AUTUMN = 7,
  WINTER = 8,
  REDWHITEBLUE = 9,
}

export interface Color {
  red: number;
  green: number;
  blue: number;
}

// The cmap is an array of of 256 number
// A number in cmap is 32 bit = 4 byte
// A number in cmap store an ABGR component (1 byte each => 4 byte)
export class ColorMap {

  public static get(model: ColorMapModel): number[] {

    // GRAY
    if (model === ColorMapModel.GRAY) {
      return this.generate([
        { red: 0, green: 0, blue: 0 },
        { red: 255, green: 255, blue: 255 }
      ]);
    }

    // JET
    if (model === ColorMapModel.JET) {
      return this.generate([
        { red: 0, green: 0, blue: 127 },
        { red: 0, green: 0, blue: 255 },
        { red: 0, green: 127, blue: 255 },
        { red: 0, green: 255, blue: 255 },
        { red: 127, green: 255, blue: 127 },
        { red: 255, green: 255, blue: 0 },
        { red: 255, green: 127, blue: 0 },
        { red: 255, green: 0, blue: 0 },
        { red: 127, green: 0, blue: 0 }
      ]);
    }

    // REDWITHEBLUE
    if (model === ColorMapModel.REDWHITEBLUE) {
      return this.generate([
        { red: 255, green: 0, blue: 0 },
        { red: 255, green: 255, blue: 255 },
        { red: 0, green: 0, blue: 255 }
      ]);
    }

    // SPRING
    if (model === ColorMapModel.SPRING) {
      return this.generate([
        { red: 255, green: 0, blue: 255 },
        { red: 255, green: 255, blue: 0 }
      ]);
    }

    // SUMMER
    if (model === ColorMapModel.SUMMER) {
      return this.generate([
        { red: 0, green: 255, blue: 102 },
        { red: 255, green: 255, blue: 102 }
      ]);
    }

    // AUTUMN
    if (model === ColorMapModel.AUTUMN) {
      return this.generate([
        { red: 255, green: 127, blue: 0 },
        { red: 255, green: 255, blue: 0 }
      ]);
    }

    // WINTER
    if (model === ColorMapModel.WINTER) {
      return this.generate([
        { red: 0, green: 0, blue: 255 },
        { red: 0, green: 255, blue: 127 }
      ]);
    }

    // HOT
    if (model === ColorMapModel.HOT) {
      return this.generate([
        { red: 0, green: 0, blue: 0 },
        { red: 255, green: 0, blue: 0 },
        { red: 255, green: 255, blue: 0 },
        { red: 255, green: 255, blue: 255 }
      ]);
    }

    // COOL
    if (model === ColorMapModel.COOL) {
      return this.generate([
        { red: 0, green: 255, blue: 255 },
        { red: 255, green: 0, blue: 255 }
      ]);
    }

    // HVS
    if (model === ColorMapModel.HSV) {
      return this.generate([
        { red: 255, green: 0, blue: 0 },
        { red: 255, green: 255, blue: 0 },
        { red: 0, green: 255, blue: 0 },
        { red: 0, green: 255, blue: 255 },
        { red: 0, green: 0, blue: 255 },
        { red: 255, green: 0, blue: 255 },
        { red: 255, green: 0, blue: 0 }
      ]);
    }

  }

  private static generate(pts: Color[]) {
    const cmap: number[] = [];
    let ii, jj;

    const nsegment = pts.length - 1;
    const lsegment = Math.floor((KCmapSize - 1) / nsegment);
    const nrest = KCmapSize - 1 - lsegment * nsegment;
    const lensegments = Array(nsegment).fill(lsegment);
    if (nsegment > 1 && nrest > 0) {
      let start = Math.round(nsegment / 2) - 1;
      lensegments[start] += 1;
      for (jj = 1; jj < nrest; jj++) {
        start += jj * Math.pow(-1, (jj % 2) + 1);
        lensegments[start] += 1;
      }
    }

    let dred, dgreen, dblue, inc, incstep;
    for (ii = 0; ii < nsegment; ii++) {
      dred = pts[ii + 1].red - pts[ii].red;
      dgreen = pts[ii + 1].green - pts[ii].green;
      dblue = pts[ii + 1].blue - pts[ii].blue;
      incstep = 1.0 / lensegments[ii];
      for (jj = 0, inc = 0; jj < lensegments[ii]; jj++, inc += incstep) {
        cmap.push(
          0xff000000 | // alpha (0xff==(255<<24)
            ((pts[ii].blue + dblue * inc) << 16) |
            ((pts[ii].green + dgreen * inc) << 8) |
            (pts[ii].red + dred * inc)
        );
      }
    }
    cmap.push(
      0xff000000 |
        (pts[nsegment].blue << 16) |
        (pts[nsegment].green << 8) |
        pts[nsegment].red
    );
    return cmap;
  }
}
