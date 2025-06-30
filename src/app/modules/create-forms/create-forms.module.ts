import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateFormsRoutingModule } from './create-forms-routing.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { StylebarComponent } from './components/stylebar/stylebar.component';
import { FormBuilderComponent } from './components/form-builder/form-builder.component';
import { FormsnavComponent } from '../../shared/components/formsnav/formsnav.component';
import { MaterialModule } from '../../shared/material.module';
import { FormModule } from '../../shared/form.module';
import { SignaturePadModule } from 'angular2-signaturepad';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    SidebarComponent,
    CanvasComponent,
    StylebarComponent,
    FormBuilderComponent,
  ],
  imports: [
    CommonModule,
    CreateFormsRoutingModule,
    MaterialModule,
    FormModule,
    SignaturePadModule,
    DragDropModule,
    FormsnavComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreateFormsModule {}
