import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { getAuth, onAuthStateChanged, Auth, User, createUserWithEmailAndPassword } from 'firebase/auth';

// import { GithubAuthProvider } from 'firebase/auth';


type AuthMode = 'Sign Up' | 'Login';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit{
  auth: Auth;
  user: User | null;
  authMethod: AuthMode = 'Login';
  authObservable: Observable<Record<string, any>>;
  buttonText: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth = getAuth();

    onAuthStateChanged(this.auth, (user) => {
      console.log(this.auth);
      this.user = user;
      console.log(this.user);
    })
  }

  onSubmit(form: NgForm) {
    if(form.invalid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    const repeatPassword = form.value.repeatPassword;

    if(this.authMethod === 'Sign Up') {
      if(password !== repeatPassword) {
        //..some sort of error
        return;
      }
      this.authObservable = this.authService.signUp(email, password);
    }
    else {
      this.authObservable = this.authService.login(email, password);
    }

    if(this.authObservable) {
      this.authObservable.subscribe(
        resData => {
          this.router.navigate(['/home']);
        }
      );
    }
  }

  toggleAuthMode() {
    this.authMethod = this.authMethod === 'Sign Up' ? 'Login' : 'Sign Up';
  }

  // githubLogin() {
  //   this.authService.gitHubLogin();
  // }

}
