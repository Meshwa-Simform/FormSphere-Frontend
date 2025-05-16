import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabSwitchComponent } from './tab-switch.component';

describe('TabSwitchComponent', () => {
  let component: TabSwitchComponent;
  let fixture: ComponentFixture<TabSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabSwitchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
