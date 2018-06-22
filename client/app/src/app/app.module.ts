import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClientModule, HttpClient } from "@angular/common/http";

//SERVICES:
import { ProductsService } from './services/products.service';
import { AuthService } from './services/auth.service';

// COMPONENTS:
import { AppComponent } from './app.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { ProductAddComponent } from './products/product-add/product-add.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AppRoutingModule } from './app-routing-.module';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { ProductCardComponent } from './products/product-card/product-card.component';
import { ProfileComponent } from './profile/profile.component';
import { MyProductsComponent } from './products/my-products/my-products.component';
import { FilterComponent } from './shared/filter/filter.component';
import { LandingComponent } from './landing/landing.component';



@NgModule({
  declarations: [
    AppComponent, 
    RegisterComponent,
    LoginComponent,
    ProductDetailComponent,
    ProductAddComponent,
    HomepageComponent,
    HeaderComponent,
    FooterComponent,
    LoadingComponent,
    ProductCardComponent,
    ProfileComponent,
    MyProductsComponent,
    FilterComponent,
    LandingComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    

  ],
  providers: [
    HttpClient,
    ProductsService,
    AuthService
  ], 

  bootstrap: [AppComponent]
})
export class AppModule { }
