declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SIGN: string;
      DATABASE_URL: string;
      NODE_ENV: "development" | "production";
      PORT?: string;
    }
  }
}

export {};
