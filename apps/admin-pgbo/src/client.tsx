import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

import React from "react";

hydrateRoot(
  document,
  <React.StrictMode>
    <StartClient />
  </React.StrictMode>,
);
