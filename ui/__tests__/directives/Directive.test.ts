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

test('Directive test', () => {
  const table = document.createElement('table');
  const td = document.createElement('td');
  const tr = document.createElement('tr');
  const tbody = document.createElement('tbody');
  tr.appendChild(td);
  tr.appendChild(td.cloneNode());
  tbody.appendChild(tr);
  tbody.appendChild(tr.cloneNode(true));
  table.appendChild(tbody);
  const div = document.createElement('div');
  div.appendChild(table);
  const binding = mock<DirectiveBinding>() as unknown as DirectiveBinding;
  binding.value = {
    onDrop: () => ({}),
    onDrag: () => ({}),
    onShadowMove: () => ({}),
    onOut: () => ({}),
  };
  expect(() => Directive.mounted(div, binding)).not.toThrow(Error);
  expect(() => Directive.updated(div, binding)).not.toThrow(Error);
  expect(() => Directive.unmounted(div)).not.toThrow(Error);
});
