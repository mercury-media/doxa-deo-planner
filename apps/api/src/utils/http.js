export function ok(res, data, meta = undefined) {
  return res.json({ data, meta, error: null });
}

export function fail(res, status, code, message, details = undefined) {
  return res.status(status).json({
    data: null,
    error: { code, message, details }
  });
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
