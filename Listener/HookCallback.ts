/**
 * Listeners of the payload of a specific event
 * */
export type HookCallback<EventPayload extends object> = (
  event: EventPayload
) => void;
