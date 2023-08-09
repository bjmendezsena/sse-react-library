import type { SSEListener } from "../Listener/BaseSSEListener";
import type { EventsMapping } from "../Listener/EventsMapping";
import type { HookCallback } from "../Listener/HookCallback";

/**
 * Fake implementation to facilitate testing
 * */
export class FakeSSEListener<TEventMapping extends EventsMapping>
  implements SSEListener<TEventMapping>
{
  private readonly listeners: Partial<{
    [K in keyof TEventMapping]: Set<HookCallback<TEventMapping[K]>>;
  }>;

  constructor() {
    this.listeners = {};
  }

  on<K extends keyof TEventMapping>(
    eventName: K,
    callback: HookCallback<TEventMapping[K]>
  ): void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = new Set();
    }

    this.listeners[eventName]!.add(callback);
  }

  off<K extends keyof TEventMapping>(
    eventName: K,
    callback: HookCallback<TEventMapping[K]>
  ): void {
    this.listeners[eventName]?.delete(callback);
  }

  /**
   * Simulates that a new event has been received
   * */
  publish<K extends keyof TEventMapping>(
    eventName: K,
    eventPayload: TEventMapping[K]
  ) {
    this.listeners[eventName]?.forEach((listener) => listener(eventPayload));
  }
}
