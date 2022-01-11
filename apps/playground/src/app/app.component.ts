import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  FormGroup,
  FormControl,
  ControlsOf,
  FormArray,
  FormBuilder,
  ValuesOf,
} from '@ngneat/reactive-forms';
import { User, UserForm } from './user.interfaces';

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

  build = this.builder.group<UserForm>({
    name: '',
    address: this.builder.group({
      street: ['', Validators.required],
    }),
    profiles: this.builder.array([]),
  });

  constructor(private builder: FormBuilder) {}

  ngOnInit() {
    const user: User = {
      name: 'My User',
      address: {
        street: 'street one',
      },
      profiles: [
        { name: 'Profile One', permissions: ['Can', 'View'] },
        { name: 'Profile Two', permissions: ['Cannot', 'Edit'] },
      ],
    };

    // This is to check that ValuesOf takes in account the Control type of a FormArray
    const valueOfUser: ValuesOf<UserForm> = user;

    valueOfUser.profiles.forEach((profile) =>
      this.build.controls.profiles.push(new FormControl(profile))
    );
    this.build.setValue(valueOfUser);

    console.log(1);
  }
}
