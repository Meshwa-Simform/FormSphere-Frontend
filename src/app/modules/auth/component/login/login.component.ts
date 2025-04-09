import { Component, signal, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  signInForm: FormGroup;

  // Error messages
  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');
  constructor(private _fb: FormBuilder, private _authService: AuthService, private _toastr: ToastrService, private _router: Router) {
    this.signInForm = this._fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/)]),
    });

    // Subscribe to all field changes for validation
    merge(
      this.signInForm.value.email.valueChanges,
      this.signInForm.value.password.valueChanges,
    ).pipe(takeUntilDestroyed()).subscribe(() => {
      this.updateErrorMessages();
    });
  }

  ngOnInit() {
    this.updateErrorMessages();
  }

  signIn() {
    if (this.signInForm.valid) {
      this._authService.LoginUser(this.signInForm.value).subscribe({
        next: () => {
          this._toastr.success('Login Successful');
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
    this.updateEmailErrorMessage();
    this.updatePasswordErrorMessage();
  }

  updateEmailErrorMessage() {
    if (this.signInForm.value.email.hasError('required')) {
      this.emailErrorMessage.set('Email is required');
    } else if (this.signInForm.value.email.hasError('email')) {
      this.emailErrorMessage.set('Please enter a valid email');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  updatePasswordErrorMessage() {
    if (this.signInForm.value.password.hasError('required')) {
      this.passwordErrorMessage.set('Password is required');
    } else if (this.signInForm.value.password.hasError('minlength')) {
      this.passwordErrorMessage.set('Password must be at least 8 characters');
    } else if (this.signInForm.value.password.hasError('maxlength')) {
      this.passwordErrorMessage.set('Password must be at less than 15 characters');
    } else if (this.signInForm.value.password.hasError('pattern')) {
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
