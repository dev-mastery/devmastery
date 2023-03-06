export interface ApplicationEvent<TData = any> {
  id: string;
  type: string;
  data: TData;
  topic: string;
  createdAt: Date;
}

export function isApplicationEvent(event: any): event is ApplicationEvent {
  return (
    event.id !== undefined &&
    event.type !== undefined &&
    event.data !== undefined &&
    event.topic !== undefined &&
    event.createdAt !== undefined
  );
}
