import cors from "cors";

const corsMiddleware = () => {
  const OPTIONS_HOSTS = [
    "localhost",
    "127.0.0.1",
    "rest-api-midu-dev-fceh.3.us-1.fl0.io",
    "http://127.0.0.1:5500",
  ];

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || OPTIONS_HOSTS.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
  };

  return cors(corsOptions);
};

export { corsMiddleware };
