export interface ApplicationEvent<TData = any> {
  id: string;
  eventType: string;
  data: TData;
  occuredAt: Date;
}

export function isApplicationEvent(event: any): event is ApplicationEvent {
  return (
    event.id !== undefined &&
    event.eventType !== undefined &&
    event.data !== undefined &&
    event.occuredAt !== undefined
  );
}
