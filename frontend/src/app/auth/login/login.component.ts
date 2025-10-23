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

                const payload = this.parseJwt(accessToken);

                const groups: string[] = payload['cognito:groups'] || [];

                localStorage.setItem("groups", JSON.stringify(groups));

                // role-based redirection
                if (groups.includes('Admin')) {
                    this.router.navigate(['/admin/artists']);
                } else {
                    this.router.navigate(['/user/discover']);
                }
            },
            error: (err) => {
                console.error('Login error:', err);
                alert('Login failed: ' + err.error.message);
            }
        });
    }


    safeDecodeBase64(str: string): string {
        let output = str.replace(/-/g, '+').replace(/_/g, '/');

        while (output.length % 4) {
            output += '=';
        }

        return atob(output);
    }


    parseJwt(token: string): any {
        try {
            const base64Url = token.split('.')[1];

            const jsonPayload = this.safeDecodeBase64(base64Url);

            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }
}
