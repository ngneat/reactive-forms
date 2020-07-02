import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import { tsquery } from '@phenomnomnominal/tsquery';
import * as fs from 'fs';
import { readFileSync, writeFileSync } from 'fs';
import * as glob from 'glob';
import * as ts from 'typescript';
import { findNodes, insertImport } from '../utils/ast-utils';
import { RemoveChange, Change, applyChanges } from '../utils/change';
import { splice } from '../utils/helpers';
import { SchemaOptions } from './schema';

const removeChanges: { [filePath: string]: Change[] } = {};
let addChanges: { [filePath: string]: Change[] } = {};

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
          c.elements.forEach((importSignNode, i) => {
            if (importSigns.includes(importSignNode.name.text)) {
              const nextElem = c.elements[i + 1];
              const prevElem = c.elements[i - 1];
              const startPos = prevElem ? prevElem.end : importSignNode.pos;
              let endPos = i === counter && nextElem ? nextElem.pos : importSignNode.end;
              existingImports.push(importSignNode.name.text);
              changes.push(new RemoveChange(path, startPos, endPos));
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

function isNodeInsideImport(node: ts.Node): boolean {
  if (node.parent) {
    return node.parent.kind === ts.SyntaxKind.ImportDeclaration ? true : isNodeInsideImport(node.parent);
  }
  return false;
}

function insertAnyGeneric(filePaths: string[], classNames: string[]) {
  for (let path of filePaths) {
    let sourceText = fs.readFileSync(path, 'utf-8');
    classNames.forEach(className => {
      const query = `Identifier[name="${className}"]`;
      tsquery(tsquery.ast(sourceText), query).forEach((node, i) => {
        if (!isNodeInsideImport(node)) {
          // we need to do it to get the updated position.
          const n = tsquery(tsquery.ast(sourceText), query)[i];
          insertChange(path, n.getEnd(), '<any>');
          sourceText = fs.readFileSync(path, 'utf-8');
        }
      });
    });
  }
}

function insertChange(path: string, pos: number, insertion: string) {
  const file = readFileSync(path, 'utf-8');
  writeFileSync(path, splice(file, pos, pos, insertion));
}

export default function(options: SchemaOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return new Promise<void>(res => {
      const controlClasses = ['FormControl', 'FormGroup', 'FormArray'];
      const importSigns = [
        ...controlClasses,
        'AbstractControl',
        'ValidatorFn',
        'AsyncValidatorFn',
        'ControlValueAccessor',
        'FormBuilder'
      ];

      glob(`${options.path}/**/*.ts`, {}, (er, files) => {
        // insertAnyGeneric(files, controlClasses);
        replaceImports(files, importSigns, '@ngneat/reactive-forms', tree);
        Object.entries(addChanges).forEach(([filePath, changes]) => (tree = applyChanges(tree, filePath, changes)));
        Object.entries(removeChanges).forEach(([filePath, changes]) => applyChanges(tree, filePath, changes));
        res();
      });
    });
  };
}
