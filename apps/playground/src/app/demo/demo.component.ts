/* eslint-disable */

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@ngenat/reactive-forms';

@Component({
  selector: 'ngneat-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    address: new FormGroup({
      street: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zip: new FormControl('')
    })
  });

  ngOnInit() {

    this.profileForm.get(['address', 'state']).setValue('state');

    this.profileForm.select(state => state.firstName).subscribe(v => {

    })
  }

}
