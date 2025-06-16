import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthAnimationComponent } from './component/auth-animation/auth-animation.component';

const routes: Routes = [
    {
        path: '',
        component:AuthAnimationComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: AuthAnimationComponent },
            { path: 'signup', component: AuthAnimationComponent },
        ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }


