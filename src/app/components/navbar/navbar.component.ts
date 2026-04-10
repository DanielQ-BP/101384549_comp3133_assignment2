import { Component, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  currentUser = this.auth.currentUser;
  userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return '?';
    return user.username.slice(0, 2).toUpperCase();
  });

  constructor(public auth: AuthService, private router: Router) {}

  logout(): void {
    this.auth.logout();
  }

  navigateToAdd(): void {
    this.router.navigate(['/employees/add']);
  }
}
