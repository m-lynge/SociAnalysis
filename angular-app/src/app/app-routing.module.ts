import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginViewComponent} from './login-view/login-view.component';
import {LoadingViewComponent} from './loading-view/loading-view.component';
import {HomeViewComponent} from './home-view/home-view.component';
import {NewProjectViewComponent} from './new-project-view/new-project-view.component';
import {ProjectViewComponent} from './project-view/project-view.component';
import {QueryTypeSelectionViewComponent} from './project-view/query-type-selection-view/query-type-selection-view.component';
import {QuerySettingViewComponent} from "./project-view/query-setting-view/query-setting-view.component";


const routes: Routes = [{path: '', component: LoginViewComponent},
    {path: 'loading', component: LoadingViewComponent},
    {path: 'home', component: HomeViewComponent},
    {path: 'opretprojekt', component: NewProjectViewComponent},
    {path: 'projekt/:queryName', component: ProjectViewComponent},
    {path: 'project_ny_soegning', component: QueryTypeSelectionViewComponent},
    {path: 'project_ny_soegning_brugerdef', component: QuerySettingViewComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
