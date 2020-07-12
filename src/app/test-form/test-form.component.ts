import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';

@Component({
  selector: 'app-test-form',
  template: `
    <form [formGroup]="group">
      <input type="text" formControlName="input" />
    </form>
  `
})
export class TestFormComponent {
  group: FormGroup<{ id: number; name: string }>;

  constructor(fb: FormBuilder) {
    this.group = fb.group({ id: 1, name: 'D' });
  }
}
