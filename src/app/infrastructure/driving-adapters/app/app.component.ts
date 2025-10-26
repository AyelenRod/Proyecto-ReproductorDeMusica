import { Component } from '@angular/core';

@Component({
  selector: 'app-root', // Este es el selector que se usa en index.html
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // Puedes dejarle el título o quitarlo, no afecta al reproductor.
  title = 'mi-reproductor'; 
}