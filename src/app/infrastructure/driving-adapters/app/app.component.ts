import { Component } from '@angular/core';
import { PlayerControlsComponent } from "../components/layout/player-controls.component";
import { SidebarComponent } from "../components/layout/sidebar.component";

@Component({
  selector: 'app-root', // Este es el selector que se usa en index.html
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [PlayerControlsComponent, SidebarComponent]
})
export class AppComponent {
  // Puedes dejarle el título o quitarlo, no afecta al reproductor.
  title = 'mi-reproductor'; 
}