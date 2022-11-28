// # auth controller 
// 'user' logic

exports.user = async (req, res, next) => {
  // # error handling: try and catch
  try {
    // assign user data to variables.
    const loginUser = req.user;

    // # res.json()
    // response of server
    res.json(loginUser);
    
  } catch (error) {
    // # next()
    // pass error to error handler
    next(error)
  }
}


