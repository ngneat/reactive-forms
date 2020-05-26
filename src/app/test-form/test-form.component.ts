import { FormControl, FormGroup } from '@angular/forms';
import { OnInit, Component } from '@angular/core';

@Component({
  selector: 'app-test-form',
  template: `
    <form [formGroup]="group">
      <input type="text" formControlName="input" />
    </form>
  `
})
export class TestFormComponent implements OnInit {
  group: FormGroup;

  constructor() {}

  ngOnInit() {
    this.group = new FormGroup({ input: new FormControl('') });
  }
}
