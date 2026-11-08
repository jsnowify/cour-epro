/**
 * In-process "a visit was counted" signal. Open streams on the same server instance get the update at once;
 * streams on other instances pick it up from the database check (see /api/visits/stream).
 */
const g = globalThis as unknown as { __visitBus?: EventTarget };
export const visitBus: EventTarget = (g.__visitBus ??= new EventTarget());
export const emitVisit = () => visitBus.dispatchEvent(new Event("visit"));
