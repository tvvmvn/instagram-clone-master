const userArgs = process.argv.slice(2);
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');

if (!userArgs[0].startsWith('mongodb')) {
  console.log('ERROR: You need to specify a valid mongodb URL as the first argument.');
  return;
}

seedDatabase();

async function seedDatabase() {
  try {
    const MONGODB_URI = userArgs[0];
    await mongoose.connect(MONGODB_URI);

    const users = [
      {
        username: 'cat',
        email: 'cat@example.com',
        name: 'Kitty',
        avatar: 'cat.jpeg',
        bio: 'Meow',
      },
      {
        username: 'dog',
        email: 'dot@example.com',
        name: 'Mr.Loyal',
        avatar: 'dog.jpeg',
        bio: 'Bark',
      },
      {
        username: 'bird',
        email: 'bird@example.com',
        name: 'Blue and White',
        avatar: 'bird.jpeg',
        bio: '',
      }
    ]

    for (let i = 0; i < users.length; i++) {
      const user = new User();
      user.username = users[i].username;
      user.email = users[i].email;
      user.name = users[i].name;
      user.avatar = users[i].avatar;
      user.bio = users[i].bio;

      await user.save();

      console.log(user);
    }

    for (let i = 1; i <= 4; i++) {
      const user = await User.findOne({ username: 'cat' });

      const post = new Post();
      post.photos = [`${i}.jpeg`];
      post.caption = `cat photos ${i}`;
      post.user = user._id;

      await post.save();

      console.log(post);
    }

  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
}

