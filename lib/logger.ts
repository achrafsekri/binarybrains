import { ConsoleLogger } from "aws-amplify/utils";

// Create a logger
if (process.env.NODE_ENV === "development") {
  // Enable debug logging
  ConsoleLogger.LOG_LEVEL = "DEBUG";
}

export const logger = new ConsoleLogger("Logger");
