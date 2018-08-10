import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ColorMap, ColorMapModel } from '../lib/colormap';
import { DataReader } from '../lib/datareader';
import { ACDImage } from '../lib/acdimage';

@Component({
  selector: 'app-acdgraph',
  templateUrl: './acdgraph.component.html',
  styleUrls: ['./acdgraph.component.css']
})
export class AcdgraphComponent implements AfterViewInit {
  @ViewChild('canvas') public eref_canvas: ElementRef;
  @ViewChild('daddy') public eref_canvas_container: ElementRef;

  private canvas: HTMLCanvasElement;
  private canvas_cx: CanvasRenderingContext2D;
  private canvas_container: HTMLDivElement;

  private graph_left = 0;   // graph left pos
  private graph_top = 0;    // graph top pos
  private graph_width = 0;  // graph width
  private graph_height = 0; // graph heigth

  private acdimage: ACDImage;
  public borderw = 1;

  public style = {
    'border-width.px': this.borderw,
    'border-style': 'solid',
    'border-color': '#333333',
    'background-color': '#ffffff'
  };

  public ngAfterViewInit() {

    this.canvas = this.eref_canvas.nativeElement;
    this.canvas_cx = this.canvas.getContext('2d');
    this.canvas_container = this.eref_canvas_container.nativeElement;

    this.canvas.height = this.canvas_container.clientHeight - this.borderw * 2;
    this.canvas.width = this.canvas_container.clientWidth - this.borderw * 2;

    this.graph_width = this.canvas.width;
    this.graph_height = this.canvas.height;

    // STOP ON DESTROY
    setInterval(() => {
      if (this.canvas_container.clientHeight !== this.canvas.height + this.borderw * 2 ||
        this.canvas_container.clientWidth !== this.canvas.width + this.borderw * 2) {

        if (this.acdimage) {
          const ratioh = this.canvas_container.clientHeight / this.canvas.height;
          const ratiow = this.canvas_container.clientWidth / this.canvas.width;
          this.canvas.height = this.canvas_container.clientHeight - this.borderw * 2;
          this.canvas.width = this.canvas_container.clientWidth - this.borderw * 2;
          this.graph_width = this.graph_width * ratiow;
          this.graph_height = this.graph_height * ratioh;
          this.graph_left = this.graph_left * ratiow;
          this.graph_top = this.graph_top * ratioh;
          this.draw();
        }

      }
    }, 10);
  }

  private draw() {
    this.canvas_cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas_cx.drawImage(this.acdimage.getImage(), this.graph_left, this.graph_top, this.graph_width, this.graph_height);
  }

  private render() {
    const cmap = ColorMap.get(ColorMapModel.JET);
    this.acdimage.produceImage(cmap).then(image => {
      this.draw();
    });
  }

  public handleMouseWheel(event: WheelEvent) {
    this.zoom(event.wheelDelta > 0 ? 1.05 : 0.95);
  }

  private zoom_in() {
    this.zoom(1.2);
  }

  private zoom_out() {
    this.zoom(0.8);
  }

  private zoom(inc: number) {
    if (!this.acdimage) { return; }
    const graph_new_width = Math.max(this.graph_width * inc, this.canvas.width);
    const graph_new_height = Math.max(this.graph_height * inc, this.canvas.height);
    const dx = Math.abs(graph_new_width - this.graph_width) / 2.0;
    const dy = Math.abs(graph_new_height - this.graph_height) / 2.0;
    if (inc > 1.0) {
      this.graph_left = this.graph_left - dx;
      this.graph_top = this.graph_top  - dy;
    } else {
      this.graph_left = this.graph_left + dx;
      this.graph_top = this.graph_top + dy;
    }
    this.graph_width = graph_new_width;
    this.graph_height = graph_new_height;
    this.draw();
  }

  private zoom_reset() {
    if (!this.acdimage) { return; }
    this.graph_left = 0;
    this.graph_top = 0;
    this.graph_width = this.canvas.width;
    this.graph_height = this.canvas.height;
    this.draw();
  }

  private context(event) {
    event.preventDefault();
  }

  private test() {
    const oReq = new XMLHttpRequest();
    oReq.open('GET', '/vel_563x3937.raw', true);
    oReq.responseType = 'arraybuffer';
    oReq.onload = oEvent => {
      const arrayBuffer = oReq.response; // Note: not oReq.responseText
      if (arrayBuffer) {
        this.acdimage = new ACDImage(DataReader.readfloat32(arrayBuffer), 563, 3937);
        this.render();
      }
    };
    oReq.send(null);
  }

  private openFile(event) {
    const input = event.target;
    const reader = new FileReader();
    reader.onload = () => {
      this.acdimage = new ACDImage(DataReader.readfloat32(reader.result), 563, 3937);
      this.render();
    };
    reader.readAsArrayBuffer(input.files[0]);
  }








}
