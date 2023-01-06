// prettier-ignore
export interface XDomainRequest {
  timeout: number;
  onerror: (ev: ErrorEvent) => any;
  onload: (ev: Event) => any;
  onprogress: (ev: ProgressEvent) => any;
  ontimeout: (ev: Event) => any;
  responseText: string;
  contentType: string;
  open(method: string, url: string): void;
  abort(): void;
  send(data?: any): void;
  addEventListener(type: "error", listener: (ev: ErrorEvent) => any, useCapture?: boolean): void;
  addEventListener(type: "load", listener: (ev: Event) => any, useCapture?: boolean): void;
  addEventListener(type: "progress", listener: (ev: ProgressEvent) => any, useCapture?: boolean): void;
  addEventListener(type: "timeout", listener: (ev: Event) => any, useCapture?: boolean): void;
  addEventListener(type: string, listener: EventListener, useCapture?: boolean): void;
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
