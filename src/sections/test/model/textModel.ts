export interface MenuGroup {
  id: number;
  title: string;
}

export interface MenuResponse {
  content: {
    id: number;
    clientId: string;
    channelId: number;
    menuGroups: MenuGroup[];
  };
  errorPresent: boolean;
  apiError: null | string;
  messages: Record<string, any>;
  message: null | string;
  responseCode: number;
  responseType: string;
}
