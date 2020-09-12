import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('schematics', () => {
  it('works', () => {
    const spy = jest.fn();
    const runner = new SchematicTestRunner('schematics', collectionPath);

    runner.runSchematicAsync('schematics', {}, Tree.empty()).subscribe(spy);
    expect(spy).toEqual([]);
  });
});
