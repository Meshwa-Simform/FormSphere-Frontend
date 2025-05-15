import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyFormsRoutingModule } from './my-forms-routing.module';
import { MaterialModule } from '../../shared/material.module';
import { MyFormsComponent } from './components/my-forms/my-forms.component';
import { SharedFormComponent } from './components/shared-form/shared-form.component';
import { FormModule } from '../../shared/form.module';
import { SignaturePadModule } from 'angular2-signaturepad';
import { ViewResponsesComponent } from './components/view-responses/view-responses.component';
import { ThankYouComponent } from '../../shared/components/thank-you/thank-you.component';


@NgModule({
  declarations: [MyFormsComponent, SharedFormComponent, ViewResponsesComponent],
  imports: [
    CommonModule,
    MyFormsRoutingModule,
    MaterialModule,
    FormModule,
    SignaturePadModule,
    ThankYouComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MyFormsModule { }
