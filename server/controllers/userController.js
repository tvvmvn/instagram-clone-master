const User = require('../models/User');

exports.create = async (req, res, next) => {
  try {
    const { email, name, username, password } = req.body;

    const user = new User();

    user.email = email;
    user.name = name;
    user.username = username;
    user.setPassword(password);

    await user.save();

    res.json({ user });

  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email } = req.body;

    const _user = await User.findOne({ email });

    const access_token = _user.generateJWT();

    const user = {
      username: _user.username,
      name: _user.name,
      avatarUrl: _user.avatarUrl,
      bio: _user.bio,
      access_token
    }

    res.json({ user })

  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const _user = req.user;

    if (req.file) {
      _user.avatar = req.file.filename;
    }

    if ('name' in req.body) {
      _user.name = req.body.name;
    }

    if ('bio' in req.body) {
      _user.bio = req.body.bio;
    }

    await _user.save();

    const access_token = _user.generateJWT();

    const user = {
      username: _user.username,
      name: _user.name,
      avatarUrl: _user.avatarUrl,
      bio: _user.bio,
      access_token
    }

    res.json({ user })

  } catch (error) {
    next(error)
  }
}