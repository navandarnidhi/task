import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ]
})
export class AppComponent {
  isLoggedIn = false;
  title = 'task';
  constructor(private router: Router) {
    this.checkLoginState();

    this.router.events.subscribe(() => {
      this.checkLoginState();
    });
  }

  private checkLoginState() {
    this.isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
  }
}
