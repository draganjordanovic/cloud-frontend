import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglesComponent } from './singles.component';

describe('SinglesComponent', () => {
  let component: SinglesComponent;
  let fixture: ComponentFixture<SinglesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SinglesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
