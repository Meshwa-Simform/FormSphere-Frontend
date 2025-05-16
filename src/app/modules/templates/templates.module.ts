import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { TemplatesRoutingModule } from './templates-routing.module';
import { TemplatesComponent } from './components/templates/templates.component';


@NgModule({
  declarations: [TemplatesComponent],
  imports: [
    CommonModule,
    TemplatesRoutingModule,
    MaterialModule
  ]
})
export class TemplatesModule { }
