import { Request, Response, NextFunction } from "express";

/**
 * Logs all requests coming in to the server
*/
export function requestLoggingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  console.log(`\n[${req.method}] ${req.path} - Request received`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.path} - Response ${res.statusCode} - ${duration}ms`);
  });

  next();
}
