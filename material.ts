import { NgModule } from '@angular/core';
import { MatButtonModule, MatToolbarModule, MatDialogModule, MatIconModule, MatSidenavModule, MatSelectModule, MatDividerModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, MatGridListModule } from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    MatIconModule,
    MatSidenavModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatDatepickerModule,
    MatGridListModule

  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    MatIconModule,
    MatSidenavModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatDatepickerModule,
    MatGridListModule

  ]
})

export class MaterialModule { }