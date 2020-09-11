import { BrowserModule } from "@angular/platform-browser";
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import {
  ApplicationHttpClient,
  applicationHttpClientCreator,
} from "@app/utils/http.client";
import { AppRoutingModule } from "@app/app-routing.module";
import { AppComponent } from "@app/app.component";
import { HomeComponent } from "@app/layouts/home/home.component";
import { SliderComponent } from "@app/layouts/home/slider/slider.component";
import { BusinessPagesComponent } from "@app/layouts/business-pages/business-pages.component";
import { TestimonialComponent } from "@app/layouts/testimonial/testimonial.component";
import { ContactUsComponent } from "@app/layouts/contact-us/contact-us.component";
import { FaqsComponent } from "@app/layouts/faqs/faqs.component";
import { FaqsDetailComponent } from "./layouts/faqs-detail/faqs-detail.component";
import { BookingPopoverComponent } from "./shared/_components/booking-popover/booking-popover.component";
import { FaqQuestionDetailsComponent } from "./layouts/faq-question-details/faq-question-details.component";
import { Angulartics2Module } from "angulartics2";
import { SharedModule } from "@app/shared/shared.module";
/**import packges */
import { SlickCarouselModule } from "ngx-slick-carousel";
import { NotifierModule } from "angular-notifier";
import { NgxSpinnerModule } from "ngx-spinner";

/** Interceptors */
import { HttpErrorInterceptorProvider } from "@app/core/interceptors/404.interceptor";

import { HttpLoaderInterceptorProvider } from "@app/core/interceptors/loader-service-interceptor";
import { AsyncRequestService } from "@app/core/services/async-request.service";
import { HttpClient } from "@angular/common/http";

import { StudentModule } from "./student/student.module";
import { TutorModule } from "./tutor/tutor.module";

import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
/*--- Route Guards ---*/
import { UnAuthGuard } from "@app/shared/_guards";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { AppTruncatePipe } from "./utils/truncate.pipe";
import { ThankYouComponent } from "./layouts/thank-you/thank-you.component";
import { AgmCoreModule } from "@agm/core";
/*--- Route Guards ---*/
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider
} from 'angularx-social-login';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SliderComponent,
    BusinessPagesComponent,
    TestimonialComponent,
    ContactUsComponent,
    FaqsComponent,
    FaqsDetailComponent,
    FaqQuestionDetailsComponent,
    AppTruncatePipe,
    ThankYouComponent,
  ],
  imports: [
    TutorModule,
    CommonModule,
    AppRoutingModule,
    StudentModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    SlickCarouselModule,
    HttpClientModule,
    SharedModule,
    SocialLoginModule,
    TooltipModule.forRoot(),
    NgxSpinnerModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: "right",
        },
        vertical: {
          position: "top",
        },
      },
    }),
    Angulartics2Module.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSDSSSDFGYLrfPZphaIc3v668-I5jxbE",
      libraries: ["places"],
    }),
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '3454-.apps.googleusercontent.com'
            ),
          }
          
        ],
      } as SocialAuthServiceConfig,
    },
    HttpErrorInterceptorProvider,
    HttpLoaderInterceptorProvider,
    AsyncRequestService,
    {
      provide: ApplicationHttpClient,
      useFactory: applicationHttpClientCreator,
      deps: [HttpClient],
    },
    UnAuthGuard,
  ],
  bootstrap: [AppComponent],
  entryComponents: [BookingPopoverComponent],
  schemas : [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
