import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { ColorPoint, ColorMap, CMapModel } from '../lib/colormap';

import { Buffer } from 'buffer';

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
  public _cs_autosize = true;
  public file: any;

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
    // this._cs.style.borderColor = 'transparent';
    // this._cx.clearRect(0, 0, this._cs_w, this._cs_h);
  }

  private test1() {
    this.clear();

    const pt1: ColorPoint = {
      color: { red: 0, blue: 0, green: 0 },
      pos: 0
    };
    const pt2: ColorPoint = {
      color: { red: 153, blue: 153, green: 153 },
      pos: 100
    };
    // const cmap = ColorMap.custom([pt1, pt2]);
    const cmap = ColorMap.create(CMapModel.RED);

    const nw = 50;
    const nh = 400;
    const imagedata = this._cx.createImageData(nw, nh);
    const ratio = 256.0 / nh;
    for (let jj = 0; jj < nh; jj++) {
      const idref = Math.ceil((jj + 1) * ratio) - 1;
      for (let ii = 0; ii < nw; ii++) {
        const idx = jj * (nw * 4) + ii * 4;
        imagedata.data[idx + 0] = (cmap[idref] >> 0) & 0xff;
        imagedata.data[idx + 1] = (cmap[idref] >> 8) & 0xff;
        imagedata.data[idx + 2] = (cmap[idref] >> 16) & 0xff;
        imagedata.data[idx + 3] = (cmap[idref] >> 24) & 0xff; // alpha always 255 (0xff)
      }
    }

    const daddy: HTMLDivElement = this.daddy.nativeElement;
    if (this._cs_autosize) {
      this._cs.height = Math.min(nh, daddy.clientHeight - 2);
      this._cs.width = Math.min(nw, daddy.clientWidth - 2);
    } else {
      this._cs.height = daddy.clientHeight - 2;
      this._cs.width = daddy.clientWidth - 2;
    }
    // const nw = 50;
    // const nh = 600;
    // const imagedata = this._cx.createImageData(nw, nh);
    // for (let jj = 0; jj < nw * nh; jj++) {
    //   imagedata[jj * 4 + 0] = 255;
    //   imagedata[jj * 4 + 1] = 0;
    //   imagedata[jj * 4 + 2] = 0;
    //   imagedata[jj * 4 + 3] = 255;
    // }

    // this.cx.putImageData(imagedata, 0, 0);
    createImageBitmap(imagedata, 0, 0, nw, nh).then(image => {
      this._cx.drawImage(image, 0, 0);
    });
  }


  private test() {

    this.testcore();

  }


  openFile(event) {
    const input = event.target;
    const reader = new FileReader();
    reader.onload = function () {
      const buff = Buffer.from(reader.result);
      for (let ii = 0; ii < 5; ii++) {
        console.log(buff.readFloatBE(ii * 4));
      }
    };
    reader.readAsArrayBuffer(input.files[0]);
  }

  // Code from https://developer.mozilla.org/En/Using_XMLHttpRequest#Receiving_binary_data
 public load_binary_resource(url) {
  const req = new XMLHttpRequest();
  req.open('GET', url, false);
  // The following line says we want to receive data as Binary and not as Unicode
  req.overrideMimeType('text/plain; charset=x-user-defined');
  req.send(null);
   if (req.status !== 200) { return ''; }
  return req.responseText;
}

  private testcore() {
    this.clear();

    const cmap = ColorMap.create(CMapModel.RED);

    const nw = 500;
    const nh = 400;
    const imagedata = this._cx.createImageData(nw, nh);
    const ratio = 256.0 / nh;
    for (let jj = 0; jj < nh; jj++) {
      const idref = Math.ceil((jj + 1) * ratio) - 1;
      for (let ii = 0; ii < nw; ii++) {
        const idx = jj * (nw * 4) + ii * 4;
        imagedata.data[idx + 0] = (cmap[idref] >> 0) & 0xff;
        imagedata.data[idx + 1] = (cmap[idref] >> 8) & 0xff;
        imagedata.data[idx + 2] = (cmap[idref] >> 16) & 0xff;
        imagedata.data[idx + 3] = (cmap[idref] >> 24) & 0xff; // alpha always 255 (0xff)
      }
    }

    const daddy: HTMLDivElement = this.daddy.nativeElement;
    if (this._cs_autosize) {
      this._cs.height = Math.min(nh, daddy.clientHeight - 2);
      this._cs.width = Math.min(nw, daddy.clientWidth - 2);
    } else {
      this._cs.height = daddy.clientHeight - 2;
      this._cs.width = daddy.clientWidth - 2;
    }

    createImageBitmap(imagedata, 0, 0, nw, nh).then(image => {
      this._cx.drawImage(image, 0, 0);
    });
  }
}
