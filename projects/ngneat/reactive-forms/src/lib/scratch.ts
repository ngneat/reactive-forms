import { FormGroup } from './formGroup';
import { FormControl } from './formControl';
import { FormArray } from './formArray';

// FORM_GROUP
interface Profile {
  firstName: string;
  lastName: string;
  skills: string[];
  address: {
    street: string;
    city: string;
  };
}

const profileForm = new FormGroup<Profile>({
  firstName: new FormControl(''),
  lastName: new FormControl(''),
  skills: new FormArray([]),
  address: new FormGroup({
    street: new FormControl(''),
    city: new FormControl('')
  })
});

profileForm.setValue({ firstName: '', lastName: '', skills: ['1'], address: { street: '', city: '' } });
profileForm.patchValue({ firstName: '' });
profileForm.valueChanges.subscribe(v => v.firstName);
profileForm.value$.subscribe(v => v.lastName);
const hasError = profileForm.hasError('required');
const getError = profileForm.getError('required');
const cityControl = profileForm.getControl('address', 'city') as FormControl<string>;
const cityControl2 = profileForm.get('address.city') as FormControl<string>;
const cityControl3 = profileForm.get(['address']) as FormGroup<Profile['address']>;
const skills = profileForm.getControl('skills') as FormArray<string>;
skills.setValue(['1']);
profileForm.reset({ lastName: '' });

// FORM_CONTROL
const one = new FormControl();
const two = new FormControl('');
const three = new FormControl<string[]>([]);
const four = new FormControl({});

four.setValue({ a: 1 });
three.setValue(['1']);
one.setValue('any');
two.setValue('');

// FORM_ARRAY
interface User {
  id: number;
  name: string;
}

const users = new FormArray<User>([]);
users.setValue([{ id: 1, name: '2' }]);
const first = users.at(0) as FormGroup<User>;
first.setValue({ id: 1, name: '2' });
const newUser = new FormGroup({ id: new FormControl(), name: new FormControl('') });
users.push(newUser);
