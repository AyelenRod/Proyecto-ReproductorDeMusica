import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false // ← AÑADE ESTO
})
export class SidebarComponent {
  constructor() { }
}