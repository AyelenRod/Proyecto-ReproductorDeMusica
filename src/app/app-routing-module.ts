import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistViewComponent } from './infrastructure/driving-adapters/components/playlist/playlist-view.component';
import { SearchViewComponent } from './infrastructure/driving-adapters/components/search/search-view.component';

const routes: Routes = [
  { path: '', component: PlaylistViewComponent },
  { path: 'search', component: SearchViewComponent }  // ← AGREGADO: Ruta de búsqueda
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }