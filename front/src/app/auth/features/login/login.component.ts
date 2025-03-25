import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../data-access/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
    email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (!this.email || !this.password) {
      alert('Please fill in both fields');
      return;
    }

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.router.navigate(['/home']);
      },
      (error) => {
        alert('Login failed');
      }
    );
  }
}
