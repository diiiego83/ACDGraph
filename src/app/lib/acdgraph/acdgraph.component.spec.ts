import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcdgraphComponent } from './acdgraph.component';

describe('AcdgraphComponent', () => {
  let component: AcdgraphComponent;
  let fixture: ComponentFixture<AcdgraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcdgraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcdgraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
