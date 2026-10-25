export function notFound(req, res) {
  res.status(404).json({ message: 'API endpoint not found.' });
}

export function errorHandler(error, req, res, next) {
  console.error(error);
  if (res.headersSent) return next(error);
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: 'The submitted data is invalid.' });
  }
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
}
