import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    const { email, password } = this.loginForm.value;

    const users = JSON.parse(sessionStorage.getItem('users') || '[]');

    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      const previousUser = sessionStorage.getItem('loggedInUser');

      if (previousUser && previousUser !== email) {
        sessionStorage.removeItem(`tasks_${previousUser}`);
      }

      sessionStorage.setItem('loggedIn', 'true');
      sessionStorage.setItem('loggedInUser', email);

      this.router.navigate(['/task']);
    } else {
      alert('Invalid credentials');
    }
  }
}
