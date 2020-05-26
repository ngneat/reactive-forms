import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as fs from 'fs';
import * as glob from 'glob';
import * as ts from 'typescript';
import { findNodes, insertImport } from '../utils/ast-utils';
import { applyChanges, RemoveChange, Change } from '../utils/change';
import { SchemaOptions } from './schema';

const removeChanges: { [filePath: string]: Change[] } = {};
const addChanges: { [filePath: string]: Change[] } = {};

function addChange(path: string, change: Change | Change[], arr): void {
  arr[path] = arr[path] ? arr[path].concat(change) : [].concat(change);
}

function getRelevantImports(sourceFile: ts.Node, importSigns: string[], host: Tree, path): string[] {
  const allImports = findNodes(sourceFile, ts.SyntaxKind.ImportDeclaration);
  const existingImports = [];

  allImports.forEach(importNode => {
    importNode.getChildren().forEach(importClause => {
      if (importClause.kind === ts.SyntaxKind.ImportClause) {
        importClause.getChildren().forEach((c: any) => {
          if (!c.elements) return;
          let counter = 0;
          const changes = [];
          c.elements.forEach(importSignNode => {
            if (importSigns.includes(importSignNode.name.text)) {
              existingImports.push(importSignNode.name.text);
              changes.push(new RemoveChange(path, importSignNode.pos, importSignNode.end));
              counter++;
            }
          });
          // if there are no import signs remove the entire import node.
          if (counter === c.elements.length) {
            addChange(path, new RemoveChange(path, importNode.pos, importNode.end), removeChanges);
          } else if (changes.length) {
            addChange(path, changes, removeChanges);
          }
        });
      }
    });
  });

  return existingImports;
}

function replaceImports(filePaths: string[], importSigns: string[], toSource: string, host) {
  for (let path of filePaths) {
    const sourceText = fs.readFileSync(path, 'utf-8');
    const sourceFile = ts.createSourceFile(path, sourceText, ts.ScriptTarget.Latest, true);
    const relevantImports = getRelevantImports(sourceFile, importSigns, host, path);
    if (relevantImports.length) {
      addChange(path, insertImport(sourceFile, path, relevantImports.join(', '), toSource), addChanges);
    }
  }
}

export default function(options: SchemaOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return new Promise<void>(res => {
      const importSigns = [
        'AbstractControl',
        'FormControl',
        'FormGroup',
        'FormArray',
        'ValidatorFn',
        'AsyncValidatorFn',
        'ControlValueAccessor',
        'Validator',
        'Validators'
      ];
      glob(`${options.path}/**/*.ts`, {}, (er, files) => {
        replaceImports(files, importSigns, '@ngneat/reactive-forms', tree);
        Object.entries(addChanges).forEach(([filePath, changes]) => applyChanges(tree, filePath, changes));
        Object.entries(removeChanges).forEach(([filePath, changes]) => applyChanges(tree, filePath, changes));
        res();
      });
    });
  };
}
