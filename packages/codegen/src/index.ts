/**
 * @open-design/codegen
 * 
 * Code generation system for Open Design visual editor
 */

// Types
export type {
  FrameworkTarget,
  GeneratedFile,
  CodeGenerationResult,
  ICodeGenerator,
  CodeGenerationOptions,
  ComponentMetadata,
} from './types/index.js';

// Generators
export {
  BaseCodeGenerator,
  NuxtCodeGenerator,
  LaravelCodeGenerator,
  ReactCodeGenerator,
  HtmlCodeGenerator,
  getCodeGenerator,
  GENERATORS,
} from './generators/index.js';

// Utilities
export {
  blockTypeToComponentName,
  toKebabCase,
  toCamelCase,
  toPascalCase,
  escapeString,
  generateComponentName,
  extractTailwindClasses,
  generatePropsInterface,
  inferPropType,
  generateVueTemplate,
  generateVueBlockTemplate,
  generateReactJSX,
  generateReactBlockJSX,
  generateHTML,
  generateHTMLBlock,
} from './utils/code-utils.js';

// Block ID Injection
export {
  injectVueBlockIds,
  injectReactBlockIds,
  injectHtmlBlockIds,
  generateOverlayBridgeScript,
} from './utils/block-id-injection.js';
