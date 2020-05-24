/**
 * @fileoverview Forbid imports from @angular/forms
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid imports from @angular/forms',
      category: 'Possible Errors',
      recommended: true
    },
    fixable: 'code',
    schema: [],
    messages: {
      avoidImport: "Avoid imports from '@angular/forms'. Change to '@ngneat/reactive-forms'.",
      useReactiveForms: "Change to '@ngneat/reactive-forms'"
    }
  },

  create: function(context) {
    // variables should be defined here
    const source = context.getSourceCode();
    const searchTerm = '@angular/forms';
    const acceptedFormTypes = ['FormControl', 'FormArray', 'FormGroup', 'FormBuilder'];

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // String.prototype.includes() polyfill
    if (!String.prototype.includes) {
      String.prototype.includes = function(search, start) {
        'use strict';

        if (search instanceof RegExp) {
          throw TypeError('first argument must not be a RegExp');
        }
        if (start === undefined) {
          start = 0;
        }
        return this.indexOf(search, start) !== -1;
      };
    }

    function checkAngularFormImport(node) {
      const importText = source.getText(node);
      if (importText.includes(searchTerm)) {
        return acceptedFormTypes.some(formType => importText.includes(formType));
      }
      return false;
    }

    function replaceAngularFormImport(node) {
      let oldImport = source.getText(node);
      let newImport = 'import {';

      acceptedFormTypes.forEach(formType => {
        if (oldImport.includes(formType)) {
          newImport += ` ${formType},`;
          const regex = new RegExp(`(${formType})+(,)*`);
          oldImport = oldImport.replace(regex, '');
        }
      });

      oldImport = oldImport
        .replace(/(\r\n|\n|\r)+/gm, '')
        .replace(/({)(\s*)/g, '{ ')
        .replace(/(\s*)(})/g, ' }')
        .replace(/(,)+(\s)*(}){1}/g, ' }');

      newImport = `${/{\W*}/g.test(oldImport) ? '' : oldImport + '\r\n'}${newImport.slice(
        0,
        -1
      )} } from '@ngneat/reactive-forms';`;
      return newImport;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration(node) {
        if (checkAngularFormImport(node)) {
          context.report({
            node,
            messageId: 'avoidImport',
            suggest: [
              {
                messageId: 'useReactiveForms'
              }
            ],
            fix(fixer) {
              const replacer = replaceAngularFormImport(node);
              return fixer.replaceText(node, replacer);
            }
          });
        }
      }
    };
  }
};
