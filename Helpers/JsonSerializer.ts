export interface Deserializer {
  /**
   * Deserializes from string
   * */
  deserialize<T>(data: string): T;
}

/**
 * Basic JSON deserializer using native implementation of JSON.parse
 * */
export class JsonDeserializer implements Deserializer {
  deserialize<T>(data: string): T {
    return JSON.parse(data);
  }
}
