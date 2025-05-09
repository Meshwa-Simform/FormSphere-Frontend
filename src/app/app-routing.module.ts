import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardsService as AuthGuard } from './services/auth/auth-guards.service';

const routes: Routes = [
  { path:'', pathMatch: 'full', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: 'create-form', loadChildren: () => import('./modules/create-forms/create-forms.module').then(m => m.CreateFormsModule), canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
