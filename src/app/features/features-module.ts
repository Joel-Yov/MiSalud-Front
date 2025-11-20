import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturesRoutingModule } from './features-routing-module';
import { LandingPage } from './landing-page/landing-page';
import { HeaderComponent } from "../shared/header/header.component";


@NgModule({
  declarations: [
    LandingPage
  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    HeaderComponent
  ]
})
export class FeaturesModule { }
