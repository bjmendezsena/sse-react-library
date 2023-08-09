import React from "react";

import type { EventMapping } from "../../sse/EventMapping";
import { SSEContext } from "../SSEContext";
import { FakeSSEListener } from "./FakeSSEListener";

/**
 * Returns a component and a fake instance to facilitate testing
 * */
export const FactoryFakeSSEProvider = () => {
  const instance = new FakeSSEListener<EventMapping>();

  /**
   * Provider of the fake instance to facilitate testing
   * */
  const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
      <SSEContext.Provider value={{ instance }}>{children}</SSEContext.Provider>
    );
  };

  return {
    instance,
    Provider,
  };
};
