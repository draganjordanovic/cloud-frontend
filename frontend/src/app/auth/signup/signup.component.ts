import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.css'
})
export class SignupComponent {

    signupForm: FormGroup;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private snackbar: MatSnackBar,
        private authService: AuthService
    ) {
        this.signupForm = this.fb.group({
            givenName: ['', [Validators.required]],
            familyName: ['', [Validators.required]],
            dob: ['', [Validators.required]],
            username: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit() {
        if (this.signupForm.valid) {
            const formData = this.signupForm.value;
            this.authService.signUp(formData).subscribe({
                next: (res) => {
                    console.log('Signup success:', res);
                    this.snackbar.open('Successful registration!', "Close", {duration: 2000});
                    this.router.navigate(['/sign-up-confirmation'], { queryParams: { username: this.signupForm.value.username } });

                },
                error: (err) => {
                    console.error('Signup error:', err);
                    alert('Error: ' + err.error.message);
                }
            });
        }
    }
}
