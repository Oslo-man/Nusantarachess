interface Document {
  getElementById(elementId: string): any;
  querySelector(selectors: string): any;
  querySelectorAll(selectors: string): NodeListOf<any>;
}

interface Element {
  querySelector(selectors: string): any;
  querySelectorAll(selectors: string): NodeListOf<any>;
}
