import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { ColorPoint, ColorMap, CMapModel } from '../lib/colormap';

import { DataReader } from '../lib/datareader';

@Component({
  selector: 'app-acdgraph',
  templateUrl: './acdgraph.component.html',
  styleUrls: ['./acdgraph.component.css']
})
export class AcdgraphComponent implements AfterViewInit {
  // a reference to the canvas element from our template
  @ViewChild('canvas') public canvas: ElementRef;
  @ViewChild('daddy') public daddy: ElementRef;

  private _cs: HTMLCanvasElement;
  private _cx: CanvasRenderingContext2D;
  public _cs_autosize = false;
  public file: any;
  private _image: ImageBitmap;
  private _zoom = 1.0;

  public ngAfterViewInit() {
    this._cs = this.canvas.nativeElement;
    this._cx = this._cs.getContext('2d');
  }

  private mode() {
    this._cs_autosize = !this._cs_autosize;
  }

  private clear() {
    this._cx.clearRect(0, 0, this._cs.width, this._cs.height);
    if (this._cs_autosize) {
      this._cs.width = 0;
      this._cs.height = 0;
    }
  }


  private test() {
    const oReq = new XMLHttpRequest();
    oReq.open('GET', '/vel_563x3937.raw', true);
    oReq.responseType = 'arraybuffer';
    oReq.onload = (oEvent) => {
      const arrayBuffer = oReq.response; // Note: not oReq.responseText
      if (arrayBuffer) {
        const data: Float32Array = DataReader.readfloat32(arrayBuffer);
        this.render(data);
      }
    };
    oReq.send(null);
  }

  openFile(event) {
    const input = event.target;
    const reader = new FileReader();
    reader.onload = () => {
      const data: Float32Array = DataReader.readfloat32(reader.result);
      this.render(data);
    };
    reader.readAsArrayBuffer(input.files[0]);
  }

  private render(data: Float32Array) {
    this.clear();

    const pt1: ColorPoint = {
      color: { red: 0, blue: 0, green: 0 },
      pos: 0
    };
    const pt2: ColorPoint = {
      color: { red: 255, blue: 255, green: 255 },
      pos: 100
    };
    let cmap: number[];
    // if (true) {
      const cmap1 = ColorMap.custom([pt1, pt2]);
    // }
    // else {
      cmap = ColorMap.create(CMapModel.BLACKWHITE);
    // }

    console.log(cmap1);
    console.log('xxxxxxxxxxxxxxxxxxxxxxx');
    console.log(cmap);
    const ncol = 3937;
    const nrow = 563;
    // const nw = 563;
    // const nh = 3937;
    // This if matrix original is line
    const imagedata = this._cx.createImageData(ncol, nrow); // is rowxcol
    let mymin = data[0];
    let mymax = data[0];
    data.forEach((val) => {
      if (val < mymin) { mymin = val; }
      if (val > mymax) { mymax = val; }
    });
    let spread = mymax - mymin;
    if (spread === 0.0) { spread = 1.0; }
    for (let jj = 0; jj < ncol; jj++) {
      for (let ii = 0; ii < nrow; ii++) {
        const idref = Math.floor((data[jj * nrow + ii] - mymin) / spread * 255.0);
        // if (idref < 0 || idref > 255 ) { console.log(idref); }
        // if ( jj * nw + ii < 2000) { console.log(idref); }
        const idx = ii * (ncol * 4) + jj * 4;
        imagedata.data[idx + 0] = (cmap[idref] >> 0) & 0xff;
        imagedata.data[idx + 1] = (cmap[idref] >> 8) & 0xff;
        imagedata.data[idx + 2] = (cmap[idref] >> 16) & 0xff;
        imagedata.data[idx + 3] = (cmap[idref] >> 24) & 0xff; // alpha always 255 (0xff)
      }
    }

    const daddy: HTMLDivElement = this.daddy.nativeElement;
    if (this._cs_autosize) {
      this._cs.height = Math.min(nrow, daddy.clientHeight - 2 - 100);
      this._cs.width = Math.min(ncol, daddy.clientWidth - 2 - 100);
    } else {
      this._cs.height = daddy.clientHeight - 2 - 100;
      this._cs.width = daddy.clientWidth - 2 - 100;
    }

    // this._cs.width -= 100;
    // const nrox = 1500;
    // const ncox = ncol;
    createImageBitmap(imagedata, 0, 0, ncol, nrow).then(image => {
      // this._cx.drawImage(image, 0, 0);
      this._image = image;
      this._cx.drawImage(image, 0, 0, this._cs.width, this._cs.height);
    });
  }

  private plus() {
    this._zoom += 0.05;
    this._cx.clearRect(0, 0, this._cs.width, this._cs.height);
    this._cx.drawImage(this._image, 0, 0, this._cs.width * this._zoom, this._cs.height * this._zoom);
  }

  private minus() {
    this._zoom -= 0.05;
    this._cx.clearRect(0, 0, this._cs.width, this._cs.height);
    this._cx.drawImage(this._image, 0, 0, this._cs.width * this._zoom, this._cs.height * this._zoom);
  }

  private reset() { // save original image measure
    this._zoom = 1.00;
    this._cx.clearRect(0, 0, this._cs.width, this._cs.height);
    this._cx.drawImage(this._image, 0, 0, this._cs.width, this._cs.height);
  }

}
