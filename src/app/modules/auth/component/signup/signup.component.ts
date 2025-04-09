import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;

  // Error messages
  nameErrorMessage = signal('');
  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');
  confirmPasswordErrorMessage = signal('');
  passwordsMatchError = signal('');
  
  // Separate visibility toggles for each password field
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  
  constructor(private _fb: FormBuilder, private _authService: AuthService, private _toastr: ToastrService, private _router: Router) {
    this.signUpForm = this._fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/)]),
      confirmPassword: new FormControl('', [Validators.required])
    });

    // Subscribe to password field changes to check match
    merge(
      this.signUpForm.value.password.valueChanges,
      this.signUpForm.value.confirmPassword.valueChanges
    ).pipe(takeUntilDestroyed()).subscribe(() => {
      this.checkPasswordsMatch();
    });

    // Subscribe to all field changes for validation
    merge(
      this.signUpForm.value.name.valueChanges,
      this.signUpForm.value.email.valueChanges,
      this.signUpForm.value.password.valueChanges,
      this.signUpForm.value.confirmPassword.valueChanges
    ).pipe(takeUntilDestroyed()).subscribe(() => {
      this.updateErrorMessages();
    });
  }
  
  ngOnInit() {
    this.updateErrorMessages();
  }

  signUp() {
    if (this.signUpForm.valid) {
      this._authService.registerUser(this.signUpForm.value).subscribe({
        next: () => {
          this._toastr.success('SignUp Successful');
        },
        error: (error) => {
            this._toastr.error(error.error.message);
        },
        complete: () => {
          this._router.navigate(['/']);
        }
      });
    } else {
      this.updateErrorMessages();
    }
  }

  updateErrorMessages() {
    this.updateNameErrorMessage();
    this.updateEmailErrorMessage();
    this.updatePasswordErrorMessage();
    this.updateConfirmPasswordErrorMessage();
    this.checkPasswordsMatch();
  }

  updateNameErrorMessage() {
    if (this.signUpForm.value.name.hasError('required')) {
      this.nameErrorMessage.set('Name is required');
    } else if (this.signUpForm.value.name.hasError('minlength')) {
      this.nameErrorMessage.set('Name must be at least 3 characters');
    } else {
      this.nameErrorMessage.set('');
    }
  }

  updateEmailErrorMessage() {
    if (this.signUpForm.value.email.hasError('required')) {
      this.emailErrorMessage.set('Email is required');
    } else if (this.signUpForm.value.email.hasError('email')) {
      this.emailErrorMessage.set('Please enter a valid email');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  updatePasswordErrorMessage() {
    if (this.signUpForm.value.password.hasError('required')) {
      this.passwordErrorMessage.set('Password is required');
    } else if (this.signUpForm.value.password.hasError('minlength')) {
      this.passwordErrorMessage.set('Password must be at least 8 characters');
    } else if (this.signUpForm.value.password.hasError('pattern')) {
      this.passwordErrorMessage.set('must contain alpha-numeric & special character');
    } else {
      this.passwordErrorMessage.set('');
    }
  }

  updateConfirmPasswordErrorMessage() {
    if (this.signUpForm.value.confirmPassword.hasError('required')) {
      this.confirmPasswordErrorMessage.set('Please confirm your password');
    } else {
      this.confirmPasswordErrorMessage.set('');
    }
  }

  checkPasswordsMatch() {
    if (this.signUpForm.value.password.value !== this.signUpForm.value.confirmPassword.value) {
      this.signUpForm.value.confirmPassword.setErrors({ passwordMismatch: true });
      this.passwordsMatchError.set('Passwords do not match');
    } else {
      // Only clear password match error, preserve other errors if any
      const errors = this.signUpForm.value.confirmPassword.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        this.signUpForm.value.confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
      }
      this.passwordsMatchError.set('');
    }
  }

  // Separate toggle functions for each password field
  togglePassword(event: MouseEvent) {
    event.preventDefault();
    this.hidePassword.set(!this.hidePassword());
  }

  toggleConfirmPassword(event: MouseEvent) {
    event.preventDefault();
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
  }

}
