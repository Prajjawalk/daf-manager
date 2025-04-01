// import { getEnvOrThrow } from "./env";

export const getEndaomentUrls = () => {
  const env = process.env.NEXT_PUBLIC_ENDAOMENT_ENVIRONMENT;

  if (env === "production") {
    return {
      auth: "https://auth.endaoment.org",
      api: "https://api.endaoment.org",
      app: "https://app.endaoment.org",
    };
  }

  return {
    auth: "https://auth.dev.endaoment.org",
    api: "https://api.dev.endaoment.org",
    app: "https://app.dev.endaoment.org",
  };
};
