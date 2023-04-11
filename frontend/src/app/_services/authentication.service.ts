import {Injectable} from "@angular/core";
import {BehaviorSubject, map, Observable} from "rxjs";
import {User} from "../_models/user";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') ?? '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    this.currentUserSubject.next(JSON.parse(localStorage.getItem('currentUser') ?? '{}'));
    return this.currentUserSubject.value;
  }

  login(account: string, pkey: string): Observable<User> {
    const user: User = {
      account: account,
      pkey: pkey
    }
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    return this.currentUserSubject;
  }

  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(new User());
    this.router.navigate(['']);
  }
}
