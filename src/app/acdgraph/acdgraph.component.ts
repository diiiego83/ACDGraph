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

  private graph = { left: 0, top: 0, width: 0, height: 0, ratio: 1.0 };
  private mouse = {
    isdown: false,
    ispan: false,
    lastpan: { x: 0, y: 0 },
    clickt: Date.now()
  };

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

    this.graph.width = this.canvas.width;
    this.graph.height = this.canvas.height;

    // STOP ON DESTROY
    setInterval(() => {
      if (this.canvas_container.clientHeight !== this.canvas.height + this.borderw * 2 ||
        this.canvas_container.clientWidth !== this.canvas.width + this.borderw * 2) {

        if (this.acdimage) {
          const ratioh = (this.canvas_container.clientHeight - this.borderw * 2) / this.canvas.height;
          const ratiow = (this.canvas_container.clientWidth - this.borderw * 2) / this.canvas.width;
          this.canvas.height = this.canvas_container.clientHeight - this.borderw * 2;
          this.canvas.width = this.canvas_container.clientWidth - this.borderw * 2;
          this.graph.width = this.graph.width * ratiow;
          this.graph.height = this.graph.height * ratioh;
          this.graph.left = this.graph.left * ratiow;
          this.graph.top = this.graph.top * ratioh;
          this.draw();
        } else {
          this.canvas.height = this.canvas_container.clientHeight - this.borderw * 2;
          this.canvas.width = this.canvas_container.clientWidth - this.borderw * 2;
        }

      }
    }, 10);
  }

  private draw() {
    this.canvas_cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas_cx.drawImage(this.acdimage.getImage(), this.graph.left, this.graph.top, this.graph.width, this.graph.height);
  }

  private render() {
    const cmap = ColorMap.get(ColorMapModel.JET);
    this.acdimage.produceImage(cmap).then(image => {
      this.draw();
    });
  }

  private zoom_in() {
    this.zoom(Math.max((this.graph.ratio - 1.0) * 0.2, 0.2));
  }

  private zoom_out() {
    this.zoom(-1 * Math.max((this.graph.ratio - 1.0) * 0.2, 0.2));
  }

  private zoom(inc: number, xCenterPos: number = this.canvas.width / 2, yCenterPos: number = this.canvas.height / 2) {

    if (!this.acdimage) { return; }

    this.graph.ratio = Math.max(1.0, this.graph.ratio + inc);

    // percentages from side
    const pX = ((this.graph.left * -1) + xCenterPos) * 100 / this.graph.width;
    const pY = ((this.graph.top * -1) + yCenterPos) * 100 / this.graph.height;

    this.graph.width = this.canvas.width * this.graph.ratio;
    this.graph.height = this.canvas.height * this.graph.ratio;

    // translate view back to center point
    let x = ((this.graph.width * pX / 100) - xCenterPos);
    let y = ((this.graph.height * pY / 100) - yCenterPos);

    // don't let viewport go over edges
    if (x < 0) { x = 0; }
    if (x + this.canvas.width > this.graph.width) {
      x = this.graph.width - this.canvas.width;
    }

    if (y < 0) { y = 0; }
    if (y + this.canvas.height > this.graph.height) {
      y = this.graph.height - this.canvas.height;
    }

    this.graph.left = x * -1;
    this.graph.top = y * -1;

    this.draw();
  }

  private zoom_reset() {
    if (!this.acdimage) { return; }
    this.graph.ratio = 1.0;
    this.graph.left = 0;
    this.graph.top = 0;
    this.graph.width = this.canvas_container.clientWidth - this.borderw * 2;
    this.graph.height = this.canvas_container.clientHeight - this.borderw * 2;
    this.draw();
  }

  public handleMouseWheel(event: WheelEvent) {
    event.preventDefault();
    if (!event.wheelDelta) { return false; }
    const inc = Math.max((this.graph.ratio - 1.0) * 0.05, 0.05); // 5% of current size
    this.zoom((event.wheelDelta > 0) ? inc : -1 * inc, event.clientX, event.clientY);
  }

  private mousedown(event: MouseEvent) {
    if (event.button === 2) {
      if (Date.now() - this.mouse.clickt < 300) {
        this.zoom_reset();
      }
      this.mouse.clickt = Date.now();
    } else if (event.button === 0) {
      this.mouse.isdown = true;
      this.mouse.ispan = false;
      this.mouse.lastpan = { x: event.clientX, y: event.clientY };
      this.canvas.style.cursor = 'grabbing';
    }
  }

  private mousemove(event: MouseEvent) {
    if (this.mouse.isdown) {
        this.mouse.ispan = true;
        const new_left = this.graph.left - (this.mouse.lastpan.x - event.clientX);
        const new_top = this.graph.top - (this.mouse.lastpan.y - event.clientY);
        if (new_left <= 0 && (new_left + this.graph.width) > this.canvas.width) {
          this.graph.left = new_left;
        }
        if (new_top <= 0 && (new_top + this.graph.height) > this.canvas.height) {
          this.graph.top = new_top;
        }
        this.mouse.lastpan = { x: event.clientX, y: event.clientY };
        this.draw();
      }
  }

  private mouseleave(event: MouseEvent) {
    this.mouse.isdown = false;
    this.mouse.ispan = false;
    this.mouse.lastpan = { x: 0, y: 0 };
    this.canvas.style.cursor = 'default';
  }

  private mouseup(event: MouseEvent) {
    // const was_click = !this.mouse.ispan;
    this.mouse.isdown = false;
    this.mouse.ispan = false;
    this.mouse.lastpan = { x: 0, y: 0 };
    this.canvas.style.cursor = 'default';
    // if (was_click) {
      // clieck event here
    // }
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
