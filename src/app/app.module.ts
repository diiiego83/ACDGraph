import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AcdgraphComponent } from './acdgraph/acdgraph.component';

@NgModule({
  declarations: [
    AppComponent,
    AcdgraphComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
