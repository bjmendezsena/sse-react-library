import type { Deserializer } from "../Helpers/JsonSerializer";
import type { SSEListener as BaseSSEListener } from "./BaseSSEListener";
import type { EventsMapping } from "./EventsMapping";
import type { HookCallback } from "./HookCallback";

export class SSEListener<TEventsMapping extends EventsMapping>
  implements BaseSSEListener<TEventsMapping>
{
  /**
   * Instance that handles connection/reconnection
   * */
  private readonly sseInstance: EventSource;

  /**
   * The different user-defined listeners that the user has added
   * */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly listeners: Map<keyof TEventsMapping, Set<HookCallback<any>>>;

  constructor(
    /**
     * Url where sse are being sent
     * */
    private url: string,
    /**
     * Configuration on reconnection mechanism
     * */
    /**
     * Deserializer of events
     * */
    private deserializer: Deserializer
  ) {
    this.sseInstance = new EventSource(this.url);
    this.listeners = new Map();
  }

  /**
   * Closes connection and stops retrying mechanism
   * */
  close() {
    this.sseInstance.close();
  }

  on<K extends keyof TEventsMapping>(
    eventName: K,
    callback: HookCallback<TEventsMapping[K]>
  ): void {
    if (!this.listeners.get(eventName)) {
      this.listeners.set(eventName, new Set());
      this.sseInstance.addEventListener(
        eventName.toString(),
        this.processorRawEvents
      );
    }

    this.listeners.get(eventName)!.add(callback);
  }

  off<K extends keyof TEventsMapping>(
    eventName: K,
    callback: HookCallback<TEventsMapping[K]>
  ): void {
    const listeners = this.listeners.get(eventName);
    if (!listeners?.has(callback)) return;

    listeners.delete(callback);

    if (listeners.size === 0) {
      this.sseInstance.removeEventListener(
        eventName.toString(),
        this.processorRawEvents
      );
      this.listeners.delete(eventName);
    }
  }

  /**
   * Receives raw events from SSE, deserialize and propagates to the user callbacks
   * */
  private readonly processorRawEvents = (rawEvent: MessageEvent<string>) => {
    const parsedData = this.deserializer.deserialize(rawEvent.data);

    const listenersToCall = this.listeners.get(rawEvent.type);

    listenersToCall?.forEach((listener) => listener(parsedData));
  };
}
