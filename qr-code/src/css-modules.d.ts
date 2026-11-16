/*
 * A `.module.css` import has no types of its own, so `import styles from "./Page.module.css"`
 * fails the type check even though Vite resolves it - and the failure looks like a broken
 * import rather than a missing declaration. Vite's own client types declare this; a plugin
 * does not pull them in, so the declaration lives here.
 *
 * Plain `.css` imports are side-effect only (`import "./plugin.css"`) and need no type.
 */

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
