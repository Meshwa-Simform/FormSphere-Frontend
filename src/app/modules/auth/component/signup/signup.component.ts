import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../interface/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;
  user!:User;
  
  // Form controls
  readonly name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required, Validators.minLength(8),Validators.pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/
  )]);
  readonly confirmPassword = new FormControl('', [Validators.required]);

  // Error messages
  nameErrorMessage = signal('');
  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');
  confirmPasswordErrorMessage = signal('');
  passwordsMatchError = signal('');
  
  // Separate visibility toggles for each password field
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  
  constructor(private fb: FormBuilder, private authService: AuthService, private toastr: ToastrService, private router: Router) {
    this.signUpForm = this.fb.group({
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
      const {name, email, password} = this.signUpForm.value;
      this.user = {name, email, password};
      this.authService.registerUser(this.user).subscribe({
        next: (data) => {
          this.toastr.success('SignUp Successful');
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
