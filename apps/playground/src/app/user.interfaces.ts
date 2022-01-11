import { FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';

export interface UserAddress {
  street: string;
}

export interface UserProfiles {
  name: string;
  permissions: string[];
}

export interface User {
  name: string;
  address: UserAddress;
  profiles: UserProfiles[];
}

export interface UserAddressForm {
  street: FormControl<string>;
}

export interface UserForm {
  name: string;
  address: FormGroup<UserAddressForm>;
  profiles: FormArray<UserProfiles, FormControl<UserProfiles>>;
}
