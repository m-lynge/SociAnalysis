import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginViewComponent } from './login-view/login-view.component';
import { LoadingViewComponent } from './loading-view/loading-view.component';
import { HomeViewComponent } from './home-view/home-view.component';
import { NewProjectViewComponent } from './new-project-view/new-project-view.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { TestFindDirectoriesComponent } from './test-find-directories/test-find-directories.component';

const routes: Routes = [{ path: '', component: LoginViewComponent },
{ path: 'loading', component: LoadingViewComponent },
{ path: 'home', component: HomeViewComponent },
{ path: 'opretprojekt', component: NewProjectViewComponent },
{ path: 'projekt', component: ProjectViewComponent},
{ path: 'serverTest', component: TestFindDirectoriesComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
