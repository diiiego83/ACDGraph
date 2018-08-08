import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { ColorMap, CMapModel } from '../lib/colormap';

import { DataReader } from '../lib/datareader';
import { ACDImage } from '../lib/acdimage';

@Component({
  selector: 'app-acdgraph',
  templateUrl: './acdgraph.component.html',
  styleUrls: ['./acdgraph.component.css']
})
export class AcdgraphComponent implements AfterViewInit {

  @ViewChild('canvas') public canvas: ElementRef;
  @ViewChild('daddy') public daddy: ElementRef;

  private _csdaddy: HTMLDivElement;
  private _cs: HTMLCanvasElement;
  private _cx: CanvasRenderingContext2D;
  private _zoom = 1.0;

  private _img: ACDImage;

  public _borderw = 1;

  public style = {
    'border-width.px': this._borderw,
    'border-style': 'solid',
    'border-color': '#333333',
    'background-color': '#ffffff'
  };

  public ngAfterViewInit() {
    this._cs = this.canvas.nativeElement;
    this._cx = this._cs.getContext('2d');
    this._csdaddy = this.daddy.nativeElement;
    this._cs.height = this._csdaddy.clientHeight - this._borderw * 2;
    this._cs.width = this._csdaddy.clientWidth - this._borderw * 2;

    // STOP ON DESTROY
    setInterval(() => {
      if (this._csdaddy.clientHeight !== this._cs.height + this._borderw * 2 ||
      this._csdaddy.clientWidth !== this._cs.width + this._borderw * 2) {
        this._cs.height = this._csdaddy.clientHeight - this._borderw * 2;
        this._cs.width = this._csdaddy.clientWidth - this._borderw * 2;
        if (this._img) {
          this._cx.drawImage(this._img.getImage(), 0, 0, this._cs.width * this._zoom, this._cs.height * this._zoom);
        }
      }
    }, 10);
  }

  private clearALL() {
    this._cx.clearRect(0, 0, this._cs.width, this._cs.height);
    this._img = undefined;
  }

  private clear() {
    this._cx.clearRect(0, 0, this._cs.width, this._cs.height);
  }

  private test() {
    const oReq = new XMLHttpRequest();
    oReq.open('GET', '/vel_563x3937.raw', true);
    oReq.responseType = 'arraybuffer';
    oReq.onload = oEvent => {
      const arrayBuffer = oReq.response; // Note: not oReq.responseText
      if (arrayBuffer) {
        this._img = new ACDImage(DataReader.readfloat32(arrayBuffer), 563, 3937);
        this.render();
      }
    };
    oReq.send(null);
  }

  private openFile(event) {
    const input = event.target;
    const reader = new FileReader();
    reader.onload = () => {
      this._img = new ACDImage(DataReader.readfloat32(reader.result), 563, 3937);
      this.render();
    };
    reader.readAsArrayBuffer(input.files[0]);
  }

  private render() {
    this.clear();
    const cmap = ColorMap.create(CMapModel.REDBLUE);
    this._img.produceImage(cmap).then(image => {
      this._cx.drawImage(image, 0, 0, this._cs.width, this._cs.height);
    });
  }

  private plus() {
    this._zoom += 0.05;
    this._cx.clearRect(0, 0, this._cs.width, this._cs.height);
    this._cx.drawImage(
      this._img.getImage(),
      0,
      0,
      this._cs.width * this._zoom,
      this._cs.height * this._zoom
    );
  }

  private minus() {
    this._zoom -= 0.05;
    this._cx.clearRect(0, 0, this._cs.width, this._cs.height);
    this._cx.drawImage(
      this._img.getImage(),
      0,
      0,
      this._cs.width * this._zoom,
      this._cs.height * this._zoom
    );
  }

  private reset() {
    // save original image measure
    this._zoom = 1.0;
    this._cx.clearRect(0, 0, this._cs.width, this._cs.height);
    this._cx.drawImage(this._img.getImage(), 0, 0, this._cs.width, this._cs.height);
  }
}
