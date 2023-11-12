const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const userArgs = process.argv.slice(2);
const [directive, MONGODB_URI] = userArgs;


/* 
  Seed data for app
*/


// Invalid MongoDB URL
if (!MONGODB_URI.startsWith("mongodb")) {
  console.log("ERROR: You need to specify a valid mongodb URL.");
  return;
}


// Check user's directive
if (directive === "run") { 
  seedDatabase();
} else if (directive === "revert") {
  dropDatabase()
} else {
  return console.log("ERROR: Invalid command");
}


async function seedDatabase() {
  try {
    
    await mongoose.connect(MONGODB_URI);

    const users = [
      {
        username: "michelangelo",
        name: "Michelangelo",
        avatar: "michelangelo.jpg",
        bio: "나는 대리석 안에서 천사를 보았고 그를 자유롭게 해줄 때까지 조각했다",
      },
      {
        username: "jobs",
        name: "Steve Jobs",
        avatar: "jobs.jpeg",
        bio: "이야 아이폰 많이 좋아졌다",
      },
      {
        username: "dog",
        name: "Mr.Loyal",
        avatar: "dog.jpeg",
        bio: "멍",
      },
    ]

    for (let i = 0; i < users.length; i++) {
      const user = new User();

      user.username = users[i].username;
      user.name = users[i].name;
      user.avatar = users[i].avatar;
      user.bio = users[i].bio;

      await user.save();

      console.log(user);
    }

    const posts = [
      {
        photos: ["david.jpg"],
        caption: "David, Galleria dell'Accademia, Florence"
      },
      {
        photos: ["pieta_1.jpg", "pieta_2.jpg"],
        caption: "Pieta, St. Peter's Basilica, Rome"
      },
      {
        photos: ["bacchus.png"],
        caption: "Bacchus, Museo Nazionale del Bargello, Florence"
      },
      {
        photos: ["angel.jpg"],
        caption: "Angel, Basilica of San Domenico, Bologna"
      },
    ]

    const user = await User.findOne({ username: "michelangelo" });

    for (let i = 0; i < posts.length; i++) {
      const post = new Post();

      post.photos = posts[i].photos
      post.caption = posts[i].caption
      post.user = user._id;

      await post.save();

      console.log(post);
    }

    console.log("seed database has completed")

  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
}


async function dropDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);

    await mongoose.connection.dropDatabase();

    console.log("drop database has completed")

  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
}