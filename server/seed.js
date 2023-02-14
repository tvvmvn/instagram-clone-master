const userArgs = process.argv.slice[2];
const mongoose = require("mongoose");
const User = require('./models/User');
const Follow = require('./models/Follow');
const Article = require('./models/Article');

if (!userArgs[0].startsWith('mongodb')) {
  console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
  return;
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);

    const users = [
      {
        username: 'cat',
        email: 'cat@example.com',
        bio: 'Meow!',
        image: 'cat.jpeg'
      },
      {
        username: 'dog',
        email: 'dot@example.com',
        bio: 'Bark!',
        image: 'dog.jpeg'
      },
      {
        username: 'bird',
        email: 'bird@example.com',
        bio: 'I can fly!',
        image: 'bird.jpeg'
      }
    ]
    
    for (let i = 0; i<users.length; i++) {
      const user = new User();
      user.username = users[i].username;
      user.email = users[i].email;
      user.bio = users[i].bio;
      user.image = users[i].image;
  
      await user.save();
  
      console.log(user);
    }
  
    for (let i = 1; i<=4; i++) {
      const user = await User.findOne({username: 'cat'});
  
      const article = new Article();
      article.images = [`${i}.jpeg`];
      article.description = `cat photos ${i}`;
      article.author = user._id;
      article.slug = `cat-${i}`
  
      await article.save();
      
      console.log(article);
    }
    
    mongoose.connection.close();
  
  } catch (error) {
    console.error(error);
  }
}

seedDatabase();
