import { createContext } from "react";
import type { EventMapping } from "../sse/EventMapping";
import type { SSEListener } from "./Listener/BaseSSEListener";

/**
 * Context to enable sharing instance of SSE
 * */
export const SSEContext = createContext<{
  instance: null | undefined | SSEListener<EventMapping>;
}>({
  instance: null,
});
