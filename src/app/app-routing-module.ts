import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistViewComponent } from './infrastructure/driving-adapters/components/pages/playlist-view.component';
import { SearchComponent } from './infrastructure/driving-adapters/components/pages/search.component';

const routes: Routes = [
  { path: '', component: PlaylistViewComponent },
  { path: 'search', component: SearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }