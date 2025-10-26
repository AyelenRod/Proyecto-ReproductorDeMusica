import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: false // ← Asegúrate que está en false
})
export class App {
  // Ya no necesitas el título si no lo usas
}