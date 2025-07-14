import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainComponent } from './components/main/main.component';
import { HeaderComponent } from './components/header/header.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { MaterialModule } from '../../shared/material.module';
import { TabSwitchComponent } from './components/tab-switch/tab-switch.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    HeroSectionComponent,
    TabSwitchComponent,
    FooterComponent,
  ],
  imports: [CommonModule, DashboardRoutingModule, MaterialModule],
})
export class DashboardModule {}
