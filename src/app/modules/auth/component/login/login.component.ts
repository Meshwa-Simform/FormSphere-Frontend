import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interface/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  signInForm: FormGroup;
  user!: User;

  // Form controls
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/)]);

  // Error messages
  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');
  constructor(private fb: FormBuilder, private authService: AuthService, private toastr: ToastrService, private router: Router) {
    this.signInForm = this.fb.group({
      email: this.email,
      password: this.password,
    });

    // Subscribe to all field changes for validation
    merge(
      this.email.valueChanges,
      this.password.valueChanges,
    ).pipe(takeUntilDestroyed()).subscribe(() => {
      this.updateErrorMessages();
    });
  }

  ngOnInit() {
    this.updateErrorMessages();
  }

  signIn() {
    if (this.signInForm.valid) {
      this.user = this.signInForm.value;
      this.authService.LoginUser(this.user).subscribe({
        next: (data) => {
          this.toastr.success('Login Successful');
        },
        error: (error) => {
          this.toastr.error(error.error.message);
        },
        complete: () => {
          this.router.navigate(['/']);
        }
      });
    } else {
      this.updateErrorMessages();
    }
  }

  updateErrorMessages() {
    this.updateEmailErrorMessage();
    this.updatePasswordErrorMessage();
  }

  updateEmailErrorMessage() {
    if (this.email.hasError('required')) {
      this.emailErrorMessage.set('Email is required');
    } else if (this.email.hasError('email')) {
      this.emailErrorMessage.set('Please enter a valid email');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  updatePasswordErrorMessage() {
    if (this.password.hasError('required')) {
      this.passwordErrorMessage.set('Password is required');
    } else if (this.password.hasError('minlength')) {
      this.passwordErrorMessage.set('Password must be at least 8 characters');
    } else if (this.password.hasError('pattern')) {
      this.passwordErrorMessage.set('must contain alpha-numeric & special character');
    } else {
      this.passwordErrorMessage.set('');
    }
  }


  // password 
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

}
