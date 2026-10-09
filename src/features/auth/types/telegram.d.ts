interface TelegramLoginData {
  id_token?: string;
  error?: string;
}

declare global {
  interface Window {
    Telegram?: {
      Login: {
        auth: (
          options: { client_id: number; scope: string[] },
          callback: (data: TelegramLoginData) => void,
        ) => void;
      };
    };
  }
}

export {};
