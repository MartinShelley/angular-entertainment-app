import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// import { GithubAuthProvider } from 'firebase/auth';


type AuthMode = 'Sign Up' | 'Login';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent {
  authMethod: AuthMode = 'Login';
  authObservable: Observable<Record<string, any>>;
  buttonText: string;

  constructor(private authService: AuthService, private router: Router) {}

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

}
