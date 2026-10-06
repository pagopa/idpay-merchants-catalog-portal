import type { getAppConfig } from './initiative';

declare const __APP_CONFIG__: ReturnType<typeof getAppConfig>;
export const appConfig = __APP_CONFIG__;
