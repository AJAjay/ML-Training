import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { LoaderComponent } from '../loader/loader.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  imports: [
    CommonModule,
    
  ],
  declarations: [MainComponent,LoaderComponent, 
    PaginationComponent],
  exports: [MainComponent,LoaderComponent, 
    PaginationComponent]
})
export class SharedModule { }
