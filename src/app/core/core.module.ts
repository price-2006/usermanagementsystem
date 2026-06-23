import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * CoreModule — imported once in the root (AppModule or bootstrapApplication providers).
 * Houses singleton services and global guards.
 * Services are all providedIn: 'root', so no explicit providers array is needed.
 */
@NgModule({
  imports: [CommonModule]
})
export class CoreModule {
  /** Guard against accidental double-import in lazy-loaded modules. */
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule has already been loaded. Import it in the root only.');
    }
  }
}
