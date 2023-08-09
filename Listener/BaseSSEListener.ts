import type { EventsMapping } from "./EventsMapping";
import type { HookCallback } from "./HookCallback";

/**
 * Generic listener of events
 * */
export interface SSEListener<TEventsMapping extends EventsMapping> {
  /**
   * Listen all events with the specified name
   * */
  on<K extends keyof TEventsMapping>(
    eventName: K,
    callback: HookCallback<TEventsMapping[K]>
  ): void;

  /**
   * Stop listening events with the specified name
   * */
  off<K extends keyof TEventsMapping>(
    eventName: K,
    callback: HookCallback<TEventsMapping[K]>
  ): void;
}
