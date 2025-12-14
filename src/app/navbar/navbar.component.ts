import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class NavbarComponent {
  constructor(private router: Router) {}

  signOut() {
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }
}
