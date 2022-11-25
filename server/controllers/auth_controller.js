exports.user = async (req, res, next) => {
  try {
    // send login user date to client
    res.json(req.user);
  } catch (error) {
    next(error)
  }
}


