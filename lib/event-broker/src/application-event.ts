export interface ApplicationEvent {
  id: string;
  type: string;
  data: Record<string, any>;
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
