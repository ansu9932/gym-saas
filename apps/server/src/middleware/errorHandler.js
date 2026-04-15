export const errorHandler = (error, _req, res, _next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: error.message || "Unexpected server error",
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack
  });
};
