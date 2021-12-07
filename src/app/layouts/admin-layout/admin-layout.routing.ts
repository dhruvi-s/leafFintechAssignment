import { Routes } from '@angular/router';

import { IconsComponent } from '../../icons/icons.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { BsesDashboardComponent } from 'app/bses-dashboard/bses-dashboard.component';
import { BsesReportComponent } from 'app/bses-report/bses-report.component';
import { TAssetsComponent } from 'app/t-assets/t-assets.component';
import { AddUpdateUsersComponent } from 'app/sensez9/users/add-update-users/add-update-users.component';
import { UsersComponent } from 'app/sensez9/users/users.component';
import { TaxpreparerComponent } from 'app/sensez9/taxpreparer/taxpreparer.component';
import { AddUpdateTaxpreparerComponent } from 'app/sensez9/taxpreparer/add-update-taxpreparer/add-update-taxpreparer.component';
import { AddUpdateSiteComponent } from 'app/sensez9/site/add-update-site/add-update-site.component';
import { SiteComponent } from 'app/sensez9/site/site.component';
import { AppointmentComponent } from 'app/screens/appointment/appointment.component';
import { SummaryComponent } from 'app/sensez9/summary/summary.component';
import { EditMessageComponent } from 'app/screens/appointment/edit-message/edit-message.component';
import { AddUpdateAppointmentComponent } from 'app/screens/appointment/add-update-appointment/add-update-appointment.component';
import { RescheduleAppointmentComponent } from 'app/screens/appointment/reschedule-appointment/reschedule-appointment.component';

export const AdminLayoutRoutes: Routes = [
 
  { path: "users", component: UsersComponent },
  { path: "addupdateUsers", component: AddUpdateUsersComponent },
  { path: "tax-preparer", component: TaxpreparerComponent },
  { path: "addupdateTaxPreparer", component: AddUpdateTaxpreparerComponent },
  { path: "site", component: SiteComponent },
  { path: "addupdateSite", component: AddUpdateSiteComponent },
  {path: "schedule", component: AppointmentComponent },
  { path: "summary", component: SummaryComponent },
  { path: "assets", component: TAssetsComponent },
  { path: "bses-dashboard", component: BsesDashboardComponent },
  { path: "bses-report", component: BsesReportComponent },
  {path: "editMessage", component:EditMessageComponent},
  {path:"editAppointment", component:AddUpdateAppointmentComponent},
  {path:"rescheduleAppointment", component:RescheduleAppointmentComponent}



  
];
