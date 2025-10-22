import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    loginForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.loginForm = this.fb.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const { username, password } = this.loginForm.value;
            console.log('Login data:', { username, password });
        }
    }
}
