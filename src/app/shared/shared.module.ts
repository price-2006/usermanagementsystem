import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SearchBarComponent } from './search-bar/search-bar.component';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';
import { UserTableComponent } from './user-table/user-table.component';
import { UserFormModalComponent } from './user-form-modal/user-form-modal.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

/**
 * SharedModule — declares and re-exports all reusable UI components and
 * common Angular modules so that feature modules only need to import SharedModule.
 */
@NgModule({
  declarations: [
    SearchBarComponent,
    ThemeToggleComponent,
    UserTableComponent,
    UserFormModalComponent,
    ConfirmModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    // Components
    SearchBarComponent,
    ThemeToggleComponent,
    UserTableComponent,
    UserFormModalComponent,
    ConfirmModalComponent,
    // Angular modules (re-exported so feature modules don't need to import them again)
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class SharedModule {}
