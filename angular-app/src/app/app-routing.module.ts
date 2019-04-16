import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginViewComponent } from './login-view/login-view.component';
import { LoadingViewComponent } from './loading-view/loading-view.component';
import { HomeViewComponent } from './home-view/home-view.component';

const routes: Routes = [{path: 'login', component: LoginViewComponent},
{path: 'loading', component: LoadingViewComponent},
 {path: 'home', component: HomeViewComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
