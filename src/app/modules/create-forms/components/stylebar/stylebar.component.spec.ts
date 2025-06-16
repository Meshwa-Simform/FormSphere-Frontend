import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StylebarComponent } from './stylebar.component';

describe('StylebarComponent', () => {
  let component: StylebarComponent;
  let fixture: ComponentFixture<StylebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StylebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StylebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
