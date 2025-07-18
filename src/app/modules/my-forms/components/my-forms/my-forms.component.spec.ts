import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFormsComponent } from './my-forms.component';

describe('MyFormsComponent', () => {
  let component: MyFormsComponent;
  let fixture: ComponentFixture<MyFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyFormsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
