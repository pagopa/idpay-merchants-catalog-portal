import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import { getAppConfig } from "./src/config/initiative";

// Load the real icons used by the catalog without evaluating the entire icon barrel.
jest.mock("@mui/icons-material", () => ({
  ChevronLeft: jest.requireActual("@mui/icons-material/ChevronLeft").default,
  ChevronRight: jest.requireActual("@mui/icons-material/ChevronRight").default,
  Store: jest.requireActual("@mui/icons-material/Store").default,
  Devices: jest.requireActual("@mui/icons-material/Devices").default,
}));

Object.assign(globalThis, {
  TextEncoder,
  TextDecoder,
  __APP_CONFIG__: getAppConfig("bonusdecoder", true),
});

Object.defineProperty(window, "scrollTo", { writable: true, value: jest.fn() });
