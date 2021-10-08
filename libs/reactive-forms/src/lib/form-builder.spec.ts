import { expectTypeOf } from 'expect-type';
import { FormControl, FormGroup } from '..';
import { GroupResolverFormBuilder, FormBuilder } from './form-builder';
import { FormArray } from './form-array';
import { Validators } from '@angular/forms';

describe('FormBuilder Types', () => {
  const builder = new FormBuilder();

  it('should return a control', () => {
    const control = builder.control('');
    expectTypeOf(control).toEqualTypeOf<FormControl<string>>();

    expect(control.getRawValue()).toMatchInlineSnapshot(`""`);
  });

  it('should return an array', () => {
    const control = builder.array<string>([]);
    expectTypeOf(control).toEqualTypeOf<
      FormArray<string, FormControl<string>>
    >();

    expect(control.getRawValue()).toMatchInlineSnapshot(`Array []`);
  });

  it('should return a group', () => {
    const control = builder.group({
      name: ['', Validators.required],
      one: '',
      phone: builder.group({
        number: '',
        prefix: '',
        nested: builder.group({
          id: 1,
        }),
      }),
      foo: new FormControl<string[]>([]),
      c: builder.array<string>([]),
    });

    expectTypeOf(control.value).toEqualTypeOf<{
      name: string;
      one: string;
      foo: string[];
      phone: {
        number: string;
        prefix: string;
        nested: {
          id: number;
        };
      };
      c: string[];
    }>();

    expectTypeOf(control.get('name')).toEqualTypeOf<FormControl<string>>();
    expectTypeOf(control.get('one')).toEqualTypeOf<FormControl<string>>();
    expectTypeOf(control.get('foo')).toEqualTypeOf<FormControl<string[]>>();

    expectTypeOf(control.get('phone')).toEqualTypeOf<
      FormGroup<
        GroupResolverFormBuilder<{
          number: string;
          prefix: string;
          nested: FormGroup<GroupResolverFormBuilder<{ id: number }>>;
        }>
      >
    >();

    expect(control.getRawValue()).toMatchInlineSnapshot(`
      Object {
        "c": Array [],
        "foo": Array [],
        "name": "",
        "one": "",
        "phone": Object {
          "nested": Object {
            "id": 1,
          },
          "number": "",
          "prefix": "",
        },
      }
    `);

    try {
      builder.group({
        // @ts-expect-error - should be typed
        invalid: [1, 1, 1],
        // @ts-expect-error - should be typed
        invalid2: [1, 1],
        valid: [1],
        validTwo: [1, null],
        validThree: [1, Validators.required],
        validFour: 4,
      });
    } catch {
      //
    }
  });
});
