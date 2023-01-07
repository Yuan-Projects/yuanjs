export interface ElementWithLegacy extends Element {
  msMatchesSelector(selectors: string): boolean;
  matchesSelector(selectors: string): boolean;
  mozMatchesSelector(selectors: string): boolean;
}

export interface AjaxOptions {
  url: string;
  crossDomain: boolean;
  type: string;
  asyc: boolean;
  success: (data: any, xhr: any) => void;
  error: (statusText: string, xhr: any) => any;
  complete: (xhr: any, textStatus: string) => any;
  data: string | object;
  dataType: string;
  contentType: string;
  timeout: number;
  headers: object;
}
