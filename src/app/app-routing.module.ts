import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { SecondPartComponent } from './second-part/second-part.component';
import { ThirdPartComponent } from './third-part/third-part.component';
import { ContactBookComponent } from './contact-book/contact-book.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'personal-info', component: PersonalInfoComponent },
  { path: 'second-part', component: SecondPartComponent },
  { path: 'third-part', component: ThirdPartComponent },
  { path: 'contact-book', component: ContactBookComponent },
  { path: 'map', component: MapComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
