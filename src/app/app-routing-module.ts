import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Importa la página que quieres mostrar
import { PlaylistViewComponent } from '../app/infrastructure/driving-adapters/components/pages/playlist-view.component'

const routes: Routes = [
  // Esto le dice al <router-outlet> que cargue PlaylistViewComponent por defecto
  { path: '', component: PlaylistViewComponent },
  
  // Puedes añadir más rutas (como /buscar) aquí en el futuro
  // { path: 'buscar', component: SearchComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }