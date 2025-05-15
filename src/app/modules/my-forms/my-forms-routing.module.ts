import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyFormsComponent } from './components/my-forms/my-forms.component';

const routes: Routes = [
  {
    path:'',
    component: MyFormsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyFormsRoutingModule { }
