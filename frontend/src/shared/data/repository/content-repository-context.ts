import { createContext } from "react";

import type { ContentRepository } from "./repository.types";

export const ContentRepositoryContext = createContext<ContentRepository | null>(null);
