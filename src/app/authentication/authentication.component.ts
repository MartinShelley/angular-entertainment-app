import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, FormBuilder, Validators } from '@angular/forms';
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
export class AuthenticationComponent implements OnInit {
  authForm: FormGroup;
  authMethod: AuthMode = 'Login';
  authObservable: Observable<Record<string, any>>;
  buttonText: string;
  errorMessage: string | null;
  isLoading: boolean;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.authForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      repeatPassword: new FormControl('')
    })
  }

  onSubmit() {
    this.errorMessage = null;
    this.isLoading = true;
    if(this.authForm.invalid) {
      return;
    }

    const email = this.authForm.value.email;
    const password = this.authForm.value.password;
    const repeatPassword = this.authForm.value.repeatPassword;

    if(this.authMethod === 'Sign Up') {
      if(password !== repeatPassword) {
        this.errorMessage = "The password you have entered doesn't match, please try again"
        return;
      }
      this.authObservable = this.authService.signUp(email, password);
    }
    else {
      this.authObservable = this.authService.login(email, password);
    }

    this.authObservable.subscribe(
      {
        // next: () => {

        // },
        error: (err: string) => {
          this.errorMessage = err;
        },
        complete: () => {
          this.isLoading = false;
          this.router.navigate(['/home']);
        }
      }
    );
  }

  gitHubLogin() {
    this.authService.gitHubLogin();
  }

  toggleAuthMode() {
    this.errorMessage = null;
    this.authForm.reset();
    this.authMethod = this.authMethod === 'Sign Up' ? 'Login' : 'Sign Up';
  }

}
