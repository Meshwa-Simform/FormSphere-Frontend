import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  // prettier-ignore
  // eslint-disable-next-line 
  standalone: false,
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

  // Form controls for html checks
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/)]);
  confirmPassword = new FormControl('', [Validators.required]);

  // Separate visibility toggles for each password field
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  constructor(private _fb: FormBuilder, private _authService: AuthService, private _toastr: ToastrService, private _router: Router, private _route: ActivatedRoute) {
    this.signUpForm = this._fb.group({
      name: this.name,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    });

    // Subscribe to password field changes to check match
    merge(
      this.password.valueChanges,
      this.confirmPassword.valueChanges
    ).pipe(takeUntilDestroyed()).subscribe(() => {
      this.checkPasswordsMatch();
    });

    // Subscribe to all field changes for validation
    merge(
      this.name.valueChanges,
      this.email.valueChanges,
      this.password.valueChanges,
      this.confirmPassword.valueChanges
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
          const returnUrl = this._route.snapshot.queryParamMap.get('returnUrl') || '/';
          this._router.navigate([returnUrl]);
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
    if (this.name.hasError('required')) {
      this.nameErrorMessage.set('Name is required');
    } else if (this.name.hasError('minlength')) {
      this.nameErrorMessage.set('Name must be at least 3 characters');
    } else {
      this.nameErrorMessage.set('');
    }
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

  updateConfirmPasswordErrorMessage() {
    if (this.confirmPassword.hasError('required')) {
      this.confirmPasswordErrorMessage.set('Please confirm your password');
    } else {
      this.confirmPasswordErrorMessage.set('');
    }
  }

  checkPasswordsMatch() {
    if (this.password.value !== this.confirmPassword.value) {
      this.confirmPassword.setErrors({ passwordMismatch: true });
      this.passwordsMatchError.set('Passwords do not match');
    } else {
      // Only clear password match error, preserve other errors if any
      const errors = this.confirmPassword.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        this.confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
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
