import { Component } from '@angular/core';

import { FormControl, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-test-form',
  template: `
    <form [formGroup]="group">
      <input type="text" formControlName="input" />
    </form>
  `
})
export class TestFormComponent {
  control: FormControl = new FormControl();

  constructor() {
    const control = new FormArray([]);
    control.setControl(0, new FormGroup({}));
    control.at(0).setValue({ name: 'itay' });
  }
}
