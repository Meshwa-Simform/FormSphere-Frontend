import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedFormComponent } from './modules/my-forms/components/shared-form/shared-form.component';
import { AuthGuardsService as AuthGuard } from './services/auth/auth-guards.service';
import { ThankYouComponent } from './shared/components/thank-you/thank-you.component';
import { ViewResponsesComponent } from './modules/my-forms/components/view-responses/view-responses.component';

const routes: Routes = [
  { path:'', pathMatch: 'full', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: 'create-form', loadChildren: () => import('./modules/create-forms/create-forms.module').then(m => m.CreateFormsModule), canActivate: [AuthGuard] },
  { path: 'my-forms', loadChildren: () => import('./modules/my-forms/my-forms.module').then(m => m.MyFormsModule), canActivate: [AuthGuard] },
  { path: 'update-form/:formId', loadChildren: () => import('./modules/create-forms/create-forms.module').then(m => m.CreateFormsModule), canActivate: [AuthGuard] },
  { path: 'shared-form/:formId', component: SharedFormComponent, canActivate: [AuthGuard] },
  { path: 'thank-you', component: ThankYouComponent, canActivate: [AuthGuard] },
  { path: 'responses/:formId', component: ViewResponsesComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
