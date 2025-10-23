import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AUTH_ENDPOINT} from "../shared/app.constants";


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = AUTH_ENDPOINT;

    constructor(private http: HttpClient) { }

    signUp(userData: any): Observable<any> {
        return this.http.post(
            `${AUTH_ENDPOINT}/sign-up`,
            userData,
            { headers: { 'Content-Type': 'application/json' } }
        )
    }


    confirmSignUp(username: string, confirmationCode: string) {
        return this.http.post(`${AUTH_ENDPOINT}/sign-up-confirmation`, { username, confirmationCode });
    }


    resendConfirmationCode(username: string) {
        return this.http.post(`${AUTH_ENDPOINT}/resend-confirmation-code`, { username });
    }


    login(username: string, password: string): Observable<any> {
        return this.http.post(`${AUTH_ENDPOINT}/login`, { username, password });
    }
}
