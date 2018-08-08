export class ACDImage {

  private _data: Float32Array;
  private _data_nrow: number;
  private _data_ncol: number;
  private _data_min: number;
  private _data_max: number;
  private _image: ImageBitmap;

  public constructor(data: Float32Array, nrow: number, ncol: number) {
    this._data = data;
    this._data_nrow = nrow;
    this._data_ncol = ncol;
    this._data_min = this._data_max = data[0];
    data.forEach(val => {
      if (val < this._data_min) { this._data_min = val; }
      if (val > this._data_max) { this._data_max = val; }
    });
  }

  public getImage(): ImageBitmap {
    return this._image;
  }

  public produceImage(cmap: number[]) {
    return new Promise<ImageBitmap>((resolvefw, rejectfw) => {
      // col_1, col_2, ..., col_ncol => len col is nrow => nrow x ncol
      // row_1, row_2, ..., row_nrow => len row is ncol => ncol x nrow
      const imagedata = new ImageData(this._data_ncol, this._data_nrow); // cx.createImageData(ncol, nrow);
      const rowlenimg = this._data_ncol * 4;
      let ratio = this._data_max - this._data_min;
      if (ratio === 0.0) { ratio = 1.0; }
      ratio = 255.0 / ratio;
      let jj = 0, ii = 0, offsetdata = 0, offsetimg = 0, offsetcmap = 0;
      for (jj = 0; jj < this._data_ncol; jj++) {
        offsetimg = jj * 4; // (current image column
        offsetdata = jj * this._data_nrow; // current data row
        for (ii = 0; ii < this._data_nrow; ii++, offsetimg += rowlenimg) { // offsetimg = ii * rowlenimg + jj * 4
          offsetcmap = Math.round(((this._data[offsetdata + ii] - this._data_min) * ratio)); // data is col1,col2,col3.... colxrow
          if (offsetcmap > 255) { offsetcmap = 255; }
          if (offsetcmap < 0) { offsetcmap = 0; }
          imagedata.data[offsetimg + 0] = (cmap[offsetcmap] >> 0) & 0xff;
          imagedata.data[offsetimg + 1] = (cmap[offsetcmap] >> 8) & 0xff;
          imagedata.data[offsetimg + 2] = (cmap[offsetcmap] >> 16) & 0xff;
          imagedata.data[offsetimg + 3] = (cmap[offsetcmap] >> 24) & 0xff; // alpha always 255 (0xff)
        }
      }
      createImageBitmap(imagedata, 0, 0, this._data_ncol, this._data_nrow).then(image => {
        this._image = image; resolvefw(image);
      }).catch(err => rejectfw(err));
    });
  }

  // SAME DIMENSION
  // public produceImage(cmap: number[]) {
  //   return new Promise<ImageBitmap>((resolvefw, rejectfw) => {
  //     // col_1, col_2, ..., col_ncol => len col is nrow => nrow x ncol
  //     // row_1, row_2, ..., row_nrow => len row is ncol => ncol x nrow
  //     // data is 563 x 3097 colxrow
  //     // 563, 563, 563, ... 3973 volte = colxrow
  //     // 3097, 3097, 3097 ... 563 volte = rowxcol
  //     const data2 = new Float32Array(this._data_ncol * this._data_nrow);
  //     for (let cl1 = 0; cl1 < this._data_ncol; cl1++) {
  //       for (let cr1 = 0; cr1 < this._data_nrow; cr1++) {
  //         data2[cr1 * this._data_ncol + cl1] = this._data[cl1 * this._data_nrow + cr1];
  //       }
  //     }
  //     const imagedata = new ImageData(this._data_ncol, this._data_nrow); // cx.createImageData(ncol, nrow);
  //     let ratio = this._data_max - this._data_min;
  //     if (ratio === 0.0) { ratio = 1.0; }
  //     ratio = 255.0 / ratio;
  //     let rsimg = 0, rsdata = 0;
  //     let cl = 0, climg = 0, cr = 0, idcmap = 0;
  //     for (cr = 0; cr < this._data_nrow; cr++) {
  //       rsimg = cr * this._data_ncol * 4;
  //       rsdata = cr * this._data_ncol;
  //       for (cl = 0, climg = 0; cl < this._data_ncol; cl++, climg += 4) {
  //         idcmap = Math.round(((data2[rsdata + cl] - this._data_min) * ratio));
  //         if (idcmap > 255) { idcmap = 255; }
  //         if (idcmap < 0) { idcmap = 0; }
  //         imagedata.data[rsimg + climg + 0] = (cmap[idcmap] >> 0) & 0xff;
  //         imagedata.data[rsimg + climg + 1] = (cmap[idcmap] >> 8) & 0xff;
  //         imagedata.data[rsimg + climg + 2] = (cmap[idcmap] >> 16) & 0xff;
  //         imagedata.data[rsimg + climg + 3] = (cmap[idcmap] >> 24) & 0xff; // alpha always 255 (0xff)
  //       }
  //     }
  //     createImageBitmap(imagedata, 0, 0, this._data_ncol, this._data_nrow).then(image => {
  //       this._image = image; resolvefw(image);
  //     }).catch(err => rejectfw(err));
  //   });
  // }


}
