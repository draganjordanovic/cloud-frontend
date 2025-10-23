import { Component } from '@angular/core';
import {AuthService} from "../../auth.service";
import {ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
    selector: 'app-signup-confirmation',
    templateUrl: './signup-confirmation.component.html',
    styleUrl: './signup-confirmation.component.css'
})
export class SignupConfirmationComponent {
    confirmForm!: FormGroup;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private authService: AuthService
    ) { }


    ngOnInit(): void {
        this.confirmForm = this.fb.group({
            username: [{ value: '', disabled: true }, Validators.required],
            code: ['', Validators.required]
        });

        this.route.queryParams.subscribe(params => {
            if (params['username']) {
                this.confirmForm.patchValue({ username: params['username'] });
            }
        });
    }


    onSubmit() {
        if (this.confirmForm.invalid) return;

        const username = this.confirmForm.getRawValue().username;
        const code = this.confirmForm.value.code;

        this.authService.confirmSignUp(username, code).subscribe({
            next: () => {
                this.snackBar.open('Successful account confirmation!', 'Close', {duration: 2000});
                this.router.navigate(['/login']);
            },
            error: (err) => {
                alert('Error: ' + err.message);
            }
        });
    }


    resendCode() {
        const username = this.confirmForm.get('username')?.value;
        if (!username) return;

        this.authService.resendConfirmationCode(username).subscribe({
            next: () => alert('Confirmation code resent!'),
            error: (err) => alert('Error: ' + err.message)
        });
    }
}
