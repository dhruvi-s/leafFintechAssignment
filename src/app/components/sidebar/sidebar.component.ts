import { MatSidenavModule, MatSidenav } from "@angular/material/sidenav";
import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";

declare const $: any;

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  design: number;
  children: any;
  id: number;
  isOpen: boolean;
}

export var ROUTES: RouteInfo[] = [
  {
    path: "",
    title: "Site ",
    icon: "dashboard",
    class: "",
    design: 0,
    id: 1,
    children: [
      {
        path: "/site",
        title: "Site List",
        icon: "dashboard",
        class: "",
        children: [],
      },
      {
        path: "/addupdateSite",
        title: "Add Site",
        icon: "dashboard",
        class: "",
        children: [],
      },
    ],
    isOpen: false,
  },
  {
    path: "",
    title: "Users ",
    icon: "dashboard",
    class: "",
    design: 0,
    id: 2,
    children: [
      {
        path: "/users",
        title: "User List",
        icon: "dashboard",
        class: "",
        children: [],
      },
      {
        path: "/addupdateUsers",
        title: "Add User",
        icon: "dashboard",
        class: "",
        children: [],
      },
    ],
    isOpen: false,
  },
  {
    path: "",
    title: "Schedule",
    icon: "event",
    class: "",
    design: 0,
    id: 3,
    children: [
      {
        path: "/schedule",
        title: "Schedule Appointment",
        icon: "today",
        class: "",
        children: [],
      },
      {
        path: "/rescheduleAppointment",
        title: "Edit Appointment",
        icon: "today",
        class: "",
        children: [],
      },
    ],
    isOpen: false,
  },
  {
    path: "",
    title: "Tax Preparer",
    icon: "dashboard",
    class: "",
    design: 0,
    id: 4,
    children: [
      {
        path: "/tax-preparer",
        title: "Preparer List",
        icon: "dashboard",
        class: "",
        children: [],
      },
      {
        path: "/addupdateTaxPreparer",
        title: "Add Preparer",
        icon: "dashboard",
        class: "",
        children: [],
      },
    ],
    isOpen: false,
  },

  {
    path: "/login",
    title: "Log Out",
    id: 5,
    icon: "unarchive",
    class: "",
    design: 0,
    children: [],
    isOpen: false,
  },
];

export var ROUTES1: RouteInfo[] = [
  {
    path: "/schedule",
    title: "Schedule",
    icon: "event",
    class: "",
    design: 0,
    id: 2,
    children: [],
    isOpen: false,
  },

  {
    path: "/login",
    title: "Log Out",
    id: 13,
    icon: "unarchive",
    class: "",
    design: 0,
    children: [],
    isOpen: false,
  },
];

export var ROUTES2: RouteInfo[] = [
 
  {
    path: "",
    title: "Schedule",
    icon: "event",
    class: "",
    design: 0,
    id: 3,
    children: [
      {
        path: "/schedule",
        title: "Schedule Appointment",
        icon: "today",
        class: "",
        children: [],
      },
      {
        path: "/rescheduleAppointment",
        title: "Edit Appointment",
        icon: "today",
        class: "",
        children: [],
      },
    ],
    isOpen: false,
  },
  {
    path: "",
    title: "Tax Preparer",
    icon: "dashboard",
    class: "",
    design: 0,
    id: 4,
    children: [
      {
        path: "/tax-preparer",
        title: "Preparer List",
        icon: "dashboard",
        class: "",
        children: [],
      },
      {
        path: "/addupdateTaxPreparer",
        title: "Add Preparer",
        icon: "dashboard",
        class: "",
        children: [],
      },
    ],
    isOpen: false,
  },

  {
    path: "/login",
    title: "Log Out",
    id: 5,
    icon: "unarchive",
    class: "",
    design: 0,
    children: [],
    isOpen: false,
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  subMenuItem: any[];
  opened = true;
  user_name: string;
  isOpen = false;
  isOpen1 = false;
  isOpen2 = false;
  level: any;

  // username: string;
  constructor() {}

  ngOnInit() {
    var cuser = JSON.parse(localStorage.getItem("currentUser"));
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
    this.user_name = cuser.obj.first_name;
    this.level = cuser.obj.level;
    if (this.level == "4") {
      this.menuItems = ROUTES1.filter((menuItem) => menuItem);
    }
    else if(this.level == "3" || this.level == "2"){
      this.menuItems = ROUTES2.filter((menuItem) => menuItem);
    }
     else {
      this.menuItems = ROUTES.filter((menuItem) => menuItem);
    }

    // if (cuser.obj.designation == "5") {
    //   this.menuItems = ROUTES.filter(menuItem => menuItem);
    // } else if (cuser.obj.designation == "6") {
    //   this.menuItems = ROUTES.filter(menuItem => menuItem.design == 0 || menuItem.design == 6);
    // } else {
    //   this.menuItems = ROUTES.filter(menuItem => menuItem.design == 0);
    // }
  }

  togleSubMenu(event: any, a: string, menuItem: any) {
    console.log("event : ", event.target.nextElementSibling);
    console.log("menuItem:", menuItem);
    console.log("Flag:", a);
    if (this.menuItems != undefined) {
      if (this.menuItems != null) {
        this.menuItems.forEach((menu) => {
          if (menu.id == menuItem.id) {
            if (a == "1") {
              menu.isOpen = true;
            } else {
              menu.isOpen = false;
            }
          } else {
            menu.isOpen = false;
          }
        });
      }
    }

    console.log("update menuItem:", this.menuItems);

    // if (this.isOpen) {
    //   if (a == "1") {
    //     this.isOpen = false;
    //   } else {
    //     this.isOpen = false;
    //   }
    // } else {
    //   if (a == "1") {
    //     this.isOpen = false;
    //   } else {
    //     this.isOpen = true;
    //   }
    // }
  }

  isMobileMenu() {
    // if ($(window).width() > 991) {
    //   return false;
    // }
    return true;
  }
}
