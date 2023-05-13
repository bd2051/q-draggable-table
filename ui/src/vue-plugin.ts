import Directive from './directives/Directive';
import { version } from '../package.json';

function install(app: unknown) {
  app.directive(Directive.name, Directive);
}

export {
  version,
  Directive,
  install,
};
