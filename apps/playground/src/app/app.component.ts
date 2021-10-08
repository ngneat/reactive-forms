import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormGroup, FormControl, ControlsOf, FormArray, FormBuilder } from '@ngenat/reactive-forms';

interface Props {
  foo: string;
  arr: string[];
  object: {
    baz: string;
    nested: {
      key: string;
      v: {
        a: number;
      };
    };
  };
}

@Component({
  selector: 'ngneat-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  group = new FormGroup<ControlsOf<Props>>({
    foo: new FormControl(''),
    object: new FormGroup({
      baz: new FormControl(''),
      nested: new FormGroup({
        key: new FormControl(''),
        v: new FormGroup({
          a: new FormControl(1),
        }),
      }),
    }),
    arr: new FormArray([]),
  });

  build = this.builder.group({
    name: '',
    address: this.builder.group({
      street: ['', Validators.required]
    })
  })

  constructor(private builder: FormBuilder) { }

  ngOnInit() {
    console.log(1);
  }
}
