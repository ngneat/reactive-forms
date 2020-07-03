import { Component, Input } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'reactive-forms-playground';
  @Input() formGroup: FormGroup;

  ngOnInit() {
    let a = this.formGroup.controls.hello;
    let b = this.formGroup.controls.hello.patchValue('');
  }
}
