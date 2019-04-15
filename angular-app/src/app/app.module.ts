import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginViewComponent } from './login-view/login-view.component';
import { LoadingViewComponent } from './loading-view/loading-view.component';
import { HomeViewComponent } from './home-view/home-view.component';
import { NewProjectViewComponent } from './new-project-view/new-project-view.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { NewProjectComponent } from './home-view/new-project/new-project.component';
import { ProjectListComponent } from './home-view/project-list/project-list.component';
import { ProjectComponent } from './home-view/project-list/project/project.component';
import { ProjectSearchComponent } from './home-view/project-list/project-search/project-search.component';
import { NewProjectDescriptionComponent } from './new-project-view/new-project-description/new-project-description.component';
import { NewProjectGroupsComponent } from './new-project-view/new-project-groups/new-project-groups.component';
import { NewProjectOverviewComponent } from './new-project-view/new-project-overview/new-project-overview.component';
import { ProjectNavigationComponent } from './project-view/project-navigation/project-navigation.component';
import { QueryViewComponent } from './project-view/query-view/query-view.component';
import { QueryTypeSelectionViewComponent } from './project-view/query-type-selection-view/query-type-selection-view.component';
import { QuerySettingViewComponent } from './project-view/query-setting-view/query-setting-view.component';
import { QueryFilterComponent } from './project-view/query-view/query-filter/query-filter.component';
import { QueryVisualViewComponent } from './project-view/query-view/query-visual-view/query-visual-view.component';
import { QueryMenuComponent } from './project-view/query-view/query-menu/query-menu.component';
import { QueryParametersComponent } from './project-view/query-view/query-parameters/query-parameters.component';
import { QueryVisualComponent } from './project-view/query-view/query-visual-view/query-visual/query-visual.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DirectoriesService } from './directories.service';
import { NavigationComponent } from './navigation/navigation.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginViewComponent,
    LoadingViewComponent,
    HomeViewComponent,
    NewProjectViewComponent,
    ProjectViewComponent,
    NewProjectComponent,
    ProjectListComponent,
    ProjectComponent,
    ProjectSearchComponent,
    NewProjectDescriptionComponent,
    NewProjectGroupsComponent,
    NewProjectOverviewComponent,
    ProjectNavigationComponent,
    QueryViewComponent,
    QueryTypeSelectionViewComponent,
    QuerySettingViewComponent,
    QueryFilterComponent,
    QueryVisualViewComponent,
    QueryMenuComponent,
    QueryParametersComponent,
    QueryVisualComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [DirectoriesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
