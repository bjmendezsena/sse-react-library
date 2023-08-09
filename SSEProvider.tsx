import React from "react";

import type { EventMapping } from "../sse/EventMapping";
import { JsonDeserializer } from "./Helpers/JsonSerializer";
import { SSEListener } from "./Listener/SSEListener";
import { SSEContext } from "./SSEContext";

export interface SSEProviderProps {
  /**
   * Complete url where events are being received
   * */
  url: string | undefined | null;

  children: React.ReactNode;
}

/**
 * All the events emitted by iob-notifications are serialized using JSON
 * */
const deserializer = new JsonDeserializer();

/**
 * Injects a Provider to make available the instance of SSE enabling to add listener from
 * differents pages
 * */
export const SSEProvider = ({ url, children }: SSEProviderProps) => {
  const [instance, setInstance] =
    React.useState<null | SSEListener<EventMapping>>();

  React.useEffect(() => {
    if (!url) {
      instance?.close();
      setInstance(null);
      return;
    }

    const newInstance = new SSEListener<EventMapping>(url, deserializer);
    setInstance(newInstance);

    return newInstance.close.bind(newInstance);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [url]);

  return (
    <SSEContext.Provider value={{ instance }}>{children}</SSEContext.Provider>
  );
};
