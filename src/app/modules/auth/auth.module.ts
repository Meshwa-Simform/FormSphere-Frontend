import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './component/signup/signup.component';
import { MaterialModule } from '../../shared/material.module';
import { FormModule } from '../../shared/form.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './component/login/login.component';
import { AuthAnimationComponent } from './component/auth-animation/auth-animation.component';

@NgModule({
  declarations: [
    SignupComponent,
    LoginComponent,
    AuthAnimationComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
