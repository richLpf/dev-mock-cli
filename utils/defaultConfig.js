const defaultConfig = {
  port: 9000,
  type: "restful",
  proxyApiUrl: "",
  cors: {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Accesstoken"],
    allowCredentials: true,
    maxAge: 86400,
  },
  swaggerApi: [],
  requestPriority: ["local", "swagger", "proxy"],
  mockFields: {
    RetCode: {
      fixedValue: 0,
    }
  }
};

export default defaultConfig;