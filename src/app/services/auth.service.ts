import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Observable, tap, map, catchError, throwError } from 'rxjs';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../graphql/queries';
import { AuthPayload, User } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private _currentUser = signal<User | null>(this.loadUser());
  private _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));

  currentUser = this._currentUser.asReadonly();
  isLoggedIn = computed(() => !!this._token() && !!this._currentUser());

  constructor(private apollo: Apollo, private router: Router) {}

  // Backend login is a Query, so we use apollo.query
  login(usernameOrEmail: string, password: string): Observable<AuthPayload> {
    return this.apollo
      .query<{ login: AuthPayload }>({
        query: LOGIN_MUTATION,
        variables: { usernameOrEmail, password },
      })
      .pipe(
        map((result) => {
          const payload = result.data?.login;
          if (!payload) throw new Error('Login failed');
          return payload;
        }),
        tap((payload) => this.storeSession(payload)),
        catchError((err) => throwError(() => this.extractError(err)))
      );
  }

  signup(username: string, email: string, password: string): Observable<AuthPayload> {
    return this.apollo
      .mutate<{ signup: AuthPayload }>({
        mutation: SIGNUP_MUTATION,
        variables: { username, email, password },
      })
      .pipe(
        map((result) => {
          const payload = result.data?.signup;
          if (!payload) throw new Error('Signup failed');
          return payload;
        }),
        tap((payload) => this.storeSession(payload)),
        catchError((err) => throwError(() => this.extractError(err)))
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._token.set(null);
    this._currentUser.set(null);
    this.apollo.client.clearStore();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this._token();
  }

  private storeSession(payload: AuthPayload): void {
    localStorage.setItem(this.TOKEN_KEY, payload.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(payload.user));
    this._token.set(payload.token);
    this._currentUser.set(payload.user);
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private extractError(err: any): Error {
    const msg =
      err?.graphQLErrors?.[0]?.message ||
      err?.networkError?.message ||
      err?.message ||
      'An error occurred';
    return new Error(msg);
  }
}
