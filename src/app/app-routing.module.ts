import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UnAuthGuard, AuthGuard } from "@app/shared/_guards";
import { HomeComponent } from "./layouts/home/home.component";
import { BusinessPagesComponent } from "./layouts/business-pages/business-pages.component";
import { ContactUsComponent } from "./layouts/contact-us/contact-us.component";
import { FaqsComponent } from "./layouts/faqs/faqs.component";
import { PageNotFoundComponent } from "./error-pages/page-not-found/page-not-found.component";
import { TutorDetailComponent } from "./shared/_components/tutor-detail/tutor-detail.component";
import { CheckoutComponent } from "@app/shared/_components/checkout/checkout.component";
import { CartItemsComponent } from "@app/shared/_components/cart-items/cart-items.component";
import { One2onesessionComponent } from "./shared/_components/one2onesession/one2onesession.component";
import { FaqsDetailComponent } from "./layouts/faqs-detail/faqs-detail.component";
import { FaqQuestionDetailsComponent } from "./layouts/faq-question-details/faq-question-details.component";
import { PreloadAllModules } from "@angular/router";
import { StudentProfileComponent } from "./shared/_components/student-profile/student-profile.component";
import { NotificationsComponent } from "./shared/_components/notifications/notifications.component";
import { NotificationDetailComponent } from "./shared/_components/notification-detail/notification-detail.component";
import { ThankYouComponent } from "./layouts/thank-you/thank-you.component";

const routes: Routes = [
  {
    path: "",
    data: { title: "SchoolarBees" },
    component: HomeComponent,
    canActivate: [UnAuthGuard],
  },
  {
    path: "contact-us",
    data: { title: "SchoolarBees | Contact us" },
    component: ContactUsComponent,
    // canActivate: [UnAuthGuard]
  },

  {
    path: "faqs",
    data: { title: "SchoolarBees | Faqs" },
    component: FaqsComponent,
    // canActivate: [UnAuthGuard]
  },
  {
    path: "faqs/article/:slug",
    component: FaqQuestionDetailsComponent,
    // canActivate: [UnAuthGuard]
  },
  {
    path: "faqs/:slug",
    component: FaqsDetailComponent,
    // canActivate: [UnAuthGuard]
  },
  {
    path: "booking-confirmed",
    component: ThankYouComponent,
    // canActivate: [UnAuthGuard]
  },
  {
    path: "booking-canceled",
    component: ThankYouComponent,
    // canActivate: [UnAuthGuard]
    data: {cancellation:true}
  },

  {
    path: "admin/session/:id",
    component: One2onesessionComponent,
    canActivate: [UnAuthGuard],
  },

  // tslint:disable-next-line:max-line-length
  {
    path: "page-not-found",
    data: { title: "SchoolarBees | Page Not Found" },
    component: PageNotFoundComponent,
    // canActivate: [UnAuthGuard],
  },

  {
    path: "",
    canActivate: [UnAuthGuard],
    loadChildren: () =>
      import("./auth/auth.module").then((mod) => mod.AuthModule),
  },
  {
    path: "contact-us",
    data: { title: "SchoolarBees | Contact us" },
    component: ContactUsComponent,
    canActivate: [UnAuthGuard],
  },
  {
    path: "question",
    loadChildren: () =>
      import("./question-answer/question-answer.module").then(
        (mod) => mod.QuestionAnswerModule
      ),
  },
  {
    path: "stream",
    loadChildren: () =>
      import("./whiteboard/whiteboard.module").then(
        (mod) => mod.WhiteboardModule
      ),
  },
  {
    path: "course",
    loadChildren: () =>
      import("./course/course.module").then((mod) => mod.CourseModule),
  },
  /** Tutor routing* */
  {
    path: "tutor",
    loadChildren: () =>
      import("./tutor/tutor.module").then((mod) => mod.TutorModule),
  },

  /** Student Routing */
  {
    path: "student",
    loadChildren: () =>
      import("./student/student.module").then((mod) => mod.StudentModule),
  },
  {
    path: "search",
    loadChildren: () =>
      import("./search/search.module").then((mod) => mod.SearchModule),
  },
  {
    path: "student/:slug",
    component: StudentProfileComponent,
  },
  {
    path: "notification/:id",
    component: NotificationDetailComponent,
  },
  {
    path: "tutor/:slug",
    component: TutorDetailComponent,
  },

  {
    path: "checkout",
    canActivate: [UnAuthGuard],
    component: CheckoutComponent,
  },
  {
    path: "cart-items",
    component: CartItemsComponent,
    canActivate: [UnAuthGuard],
  },
  {
    path: ":slug",
    component: BusinessPagesComponent,
    // canActivate: [UnAuthGuard]
  },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
