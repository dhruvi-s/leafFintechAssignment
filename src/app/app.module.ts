import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";

import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";

import { AppComponent } from "./app.component";

// import { DashboardComponent } from './dashboard/dashboard.component';
// import { UserProfileComponent } from './user-profile/user-profile.component';
// import { TableListComponent } from './table-list/table-list.component';
// import { TypographyComponent } from './typography/typography.component';
// import { IconsComponent } from './icons/icons.component';
// import { MapsComponent } from './maps/maps.component';
// import { NotificationsComponent } from './notifications/notifications.component';
// import { UpgradeComponent } from './upgrade/upgrade.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { BrowserModule } from "@angular/platform-browser";
import { AppService } from "./app.service";
import { ChartModule } from "angular-highcharts";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./_guards/index";
import {
  AlertService,
  AuthenticationService,
  UserService,
} from "./_services/index";
import { AlertComponent } from "./_directives/alert.component";
import { HomeComponent } from "./home/home.component";
import { JwtInterceptor } from "./_helpers/index";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
// import { RuleEngineUpdateDialogComponent } from './ruleengine/rule-engine-update-dialog/rule-engine-update-dialog.component';

import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { CdkTableModule } from "@angular/cdk/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatRippleModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSidenavModule } from "@angular/material/sidenav";
/* Angular Flex Layout */
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatMenuModule } from "@angular/material/menu";
//  import { PiechartComponent } from './device/piechart/piechart.component';
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatRadioModule } from "@angular/material/radio";
import { BsesDashboardComponent } from "./bses-dashboard/bses-dashboard.component";
import { BsesReportComponent } from "./bses-report/bses-report.component";
import { DashboardTableComponent } from "./bses-dashboard/dashboard-table/dashboard-table.component";
import { LineChartComponent } from "./bses-dashboard/line-chart/line-chart.component";
import { BarChartComponent } from "./bses-dashboard/bar-chart/bar-chart.component";
import { TAssetsComponent } from "./t-assets/t-assets.component";
import { AddAssetsComponent } from "./t-assets/add-assets/add-assets.component";
import { UsersComponent } from "./sensez9/users/users.component";
import { AddUpdateUsersComponent } from "./sensez9/users/add-update-users/add-update-users.component";

import { SiteComponent } from "./sensez9/site/site.component";
import { AddUpdateTaxpreparerComponent } from "./sensez9/taxpreparer/add-update-taxpreparer/add-update-taxpreparer.component";
import { AddUpdateSiteComponent } from "./sensez9/site/add-update-site/add-update-site.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CustomInputModule } from "./widgets/custom-input/custom-input.module";
import { SummaryComponent } from "./sensez9/summary/summary.component";
import { EditMessageComponent } from "./screens/appointment/edit-message/edit-message.component";
import { RescheduleAppointmentComponent } from "./screens/appointment/reschedule-appointment/reschedule-appointment.component";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpModule,
    ChartModule,
    ComponentsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatSidenavModule,
    RouterModule,
    NgxMaterialTimepickerModule,
    AppRoutingModule,
    MatTableModule,
    MatSortModule,
    CdkTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    MatRippleModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatRadioModule,
    MatCheckboxModule,
    CustomInputModule,
  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    AlertComponent,
    HomeComponent,
    BsesDashboardComponent,
    BsesReportComponent,
    DashboardTableComponent,
    LineChartComponent,
    BarChartComponent,
    TAssetsComponent,
    AddAssetsComponent,
    UsersComponent,
    AddUpdateUsersComponent,
    SiteComponent,
    AddUpdateTaxpreparerComponent,
    AddUpdateSiteComponent,
    SummaryComponent,
    EditMessageComponent,
    RescheduleAppointmentComponent,
  ],
  providers: [
    AppService,
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: Window,
      useValue: window,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
