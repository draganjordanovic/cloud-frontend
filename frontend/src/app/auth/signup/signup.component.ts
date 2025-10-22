import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.css'
})
export class SignupComponent {

    signupForm: FormGroup;

    constructor(private fb: FormBuilder) {
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
            console.log('Signup data:', formData);
        }
    }
}
