import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
// import { GithubAuthProvider } from 'firebase/auth';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent {

  constructor(private authService: AuthService) {}

  onSubmit(form: NgForm) {

  }

  githubLogin() {
    this.authService.gitHubLogin();
  }

}
