declare global {
    interface JSON {
      stringifyPretty(value: Parameters<JSON['stringify']>[0]): ReturnType<JSON['stringify']>;
    }
  }
  
  JSON.stringifyPretty = function (value: any): string {
    return JSON.stringify(value, null, 2);
  };
  
  export {};