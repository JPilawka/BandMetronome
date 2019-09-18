import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'songs', loadChildren: './songs/songs.module#SongsPageModule' },
  { path: 'songs', loadChildren: './songs/songs.module#SongsPageModule' },
  { path: 'set-modal', loadChildren: './set-modal/set-modal.module#SetModalPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
