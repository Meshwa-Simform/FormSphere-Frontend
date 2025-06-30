import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './modules/auth/auth.module';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
  NgxUiLoaderHttpModule,
  NgxUiLoaderRouterModule,
} from 'ngx-ui-loader';
import { MyFormsModule } from './modules/my-forms/my-forms.module';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsType: SPINNER.threeStrings,
  fgsPosition: POSITION.centerCenter,
  overlayColor: 'rgba(40, 40, 40, 0.98)',
  fgsColor: '#12A3EB',
  fgsSize: 120,
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 5,
  hasProgressBar: true,
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthModule,
    MyFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      preventDuplicates: true,
      tapToDismiss: true,
      maxOpened: 5,
      autoDismiss: true,
    }),
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    NgxUiLoaderRouterModule.forRoot({
      exclude: ['/auth/login', '/auth/signup'],
    }),
  ],
  providers: [provideHttpClient(), provideCharts(withDefaultRegisterables())],
  bootstrap: [AppComponent],
})
export class AppModule {}
