import { Component, ChangeDetectorRef } from "@angular/core";
import {
  ToggleClassService,
  UserService,
  LocalStorageService,
} from "@app/shared/_services/index";
import { Title } from "@angular/platform-browser";
import { Router, NavigationEnd } from "@angular/router";
import { AsyncRequestService } from "./core/services/async-request.service";
import { Angulartics2GoogleAnalytics } from "angulartics2/ga";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "ScholarBees";
  changeDetectorRef: ChangeDetectorRef;
  isAdmin: any;
  isAdminHoverClassCast: boolean;

  isDashboardClass = false;
  outerClass = false;
  slider_image_url = "slider_image";

  canNotificationVisible: boolean = false;

  constructor(
    private toggleClassService: ToggleClassService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private titleService: Title,
    private router: Router,
    private asyncRequestService: AsyncRequestService,
    angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics
  ) {
    angulartics2GoogleAnalytics.startTracking();
    this.asyncRequestService
      .getRequest(this.slider_image_url)
      .subscribe((response: any) => {
        localStorage.setItem("sliderImage", JSON.stringify(response.sliders));
      });
      

    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        let authRoutes = [
          "/login",
          "/register",
          "/become-a-tutor",
          "/forget-password",
          "/reset-password/:token",
          "/verify-email",
          "/account-not-verified,",
        ];

        if (!authRoutes.includes(event.url)) {
          this.fetchNotification();
        }

        if (this.router.url.search("notification") > -1) {
          this.canNotificationVisible = false;
          this.removeClassFromBody();
          this.localStorageService.set("notificationClose", 1);
        }
      });
  }

  notificationURL = "notification/listing";
  notificationResult: any;
  fetchNotification() {
    this.notificationURL = this.notificationURL;
    this.userService.fetchNotifications(this.notificationURL).subscribe(
      async (response: any) => {
        this.notificationResult = response.result;
        // need to check local
        let localNotification = this.localStorageService.get("notification");
        if (localNotification) {
          localNotification = JSON.parse(JSON.parse(localNotification));
          if (localNotification && this.notificationResult) {
            if (localNotification.id !== this.notificationResult.id) {
              this.localStorageService.remove("notificationClose");
              this.addClassFromBody();
            }
          }
        }

        if (!this.notificationResult) {
          // console.log(this.notificationResult);
          this.canNotificationVisible = false;
          this.localStorageService.remove("notification");
          this.localStorageService.remove("notificationClose");
          this.removeClassFromBody();
        } else {
          if (!this.localStorageService.get("notificationClose")) {
            this.canNotificationVisible = true;
            this.addClassFromBody();
          }
          let typeArr = ["tutor", "student"];
          if (typeArr.includes(this.localStorageService.getRole())) {
            this.localStorageService.set(
              "notification",
              JSON.stringify(response.result)
            );
          }
          if (response.result && response.result.type == "all") {
            this.localStorageService.set(
              "notification",
              JSON.stringify(response.result)
            );
          }
        }
      },
      (errorResponse: any) => {}
    );
  }
  ngOnInit() {
    this.setRootClasses();
  }

  setRootClasses() {
    this.toggleClassService.isAdminHoverClassCast.subscribe(
      (data) => (this.isAdminHoverClassCast = data)
    );
    this.toggleClassService.isDashboardClassCast.subscribe((data) =>
      setTimeout(() => (this.isDashboardClass = data), 0)
    );

    this.userService.classChangeAdmin$.subscribe((resultList) => {
      this.isAdmin = resultList;
    });

    this.titleService.setTitle("ScholarBees");

    this.asyncRequestService.getRequest("tooltips").subscribe((response) => {
      localStorage.setItem("tooltipData", JSON.stringify(response));
    });
  }

  closeNotification() {
    this.canNotificationVisible = false;
    this.localStorageService.set("notificationClose", 1);
    this.removeClassFromBody();
  }

  ngAfterViewInit() {
    if (this.router.url.search("notification") > -1) {
      this.notificationResult = [];
      this.localStorageService.set("notificationClose", 1);
      this.removeClassFromBody();
    }
  }

  onActivate(event: any) {
    let current_url = this.router.url;
    if (current_url.search("search") > -1) {
      return;
    }
    window.scroll(0, 0);
  }

  removeClassFromBody() {
    document.querySelector("body").classList.remove("alertActive");
  }

  addClassFromBody() {
    document.querySelector("body").classList.add("alertActive");
  }
}
