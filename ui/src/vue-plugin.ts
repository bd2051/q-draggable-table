import Directive from './directives/Directive';
import { version } from '../package.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function install(app: any) {
  app.directive(Directive.name, Directive);
}

export {
  version,
  Directive,
  install,
};
