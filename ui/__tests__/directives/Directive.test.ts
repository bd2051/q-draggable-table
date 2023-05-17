import { DirectiveBinding } from 'vue';
import { mock } from 'jest-mock-extended';
import Directive from '../../src/directives/Directive';

test('Directive test error', () => {
  const notTable = document.createElement('div');
  const binding = mock<DirectiveBinding>() as unknown as DirectiveBinding;
  const errorText = 'Work only with table tag';
  expect(() => Directive.mounted(notTable, binding)).toThrow(errorText);
  expect(() => Directive.updated(notTable, binding)).toThrow(errorText);
  expect(() => Directive.unmounted(notTable)).toThrow(errorText);
});
