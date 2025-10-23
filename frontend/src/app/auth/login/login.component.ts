import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    loginForm: FormGroup;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private authService: AuthService
    ) {
        this.loginForm = this.fb.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });
    }



    onSubmit() {
        if (!this.loginForm.valid) return;

        const { username, password } = this.loginForm.value;

        this.authService.login(username, password).subscribe({
            next: (res: any) => {
                console.log('Login successful:', res);

                const idToken = res.idToken;
                const accessToken = res.accessToken;
                const refreshToken = res.refreshToken;

                localStorage.setItem('idToken', idToken);
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                const payload = this.parseJwt(idToken);
                const groups: string[] = payload['cognito:groups'] || [];

                console.log("grupaaa ", groups)

                // role-based redirection
                if (groups.includes('Admin')) {
                    this.router.navigate(['/admin/artists']);
                } else {
                    this.router.navigate(['/admin/upload-music']);
                }
            },
            error: (err) => {
                console.error('Login error:', err);
                alert('Login failed: ' + err.error.message);
            }
        });
    }


    parseJwt(token: string): any {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    }
}
