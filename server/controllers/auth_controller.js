exports.user = async (req, res, next) => {
  try {
    // a user found by JWT
    res.json(req.user);
  } catch (error) {
    next(error)
  }
}


