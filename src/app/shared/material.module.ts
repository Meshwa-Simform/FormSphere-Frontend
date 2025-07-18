import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatExpansionModule,
  ],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatExpansionModule,
  ],
})
export class MaterialModule {}
