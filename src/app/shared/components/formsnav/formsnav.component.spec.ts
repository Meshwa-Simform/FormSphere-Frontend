import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsnavComponent } from './formsnav.component';

describe('FormsnavComponent', () => {
  let component: FormsnavComponent;
  let fixture: ComponentFixture<FormsnavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormsnavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormsnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
