// argument vector
const userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
  console.log('Error: You need to specify a valid mongodb URL as the first argument');
  return;
}

const mongoose = require("mongoose");
const mongoDB = userArgs[0];
const {User, Article, Follow} = require("./models/model");
const crypto = require("crypto")
const fs = require("fs");

async function createUser(username, email, password = "123") {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 310000, 32, "sha256")
  .toString("hex")
  
  const files = fs.readdirSync(`./seeds/profiles`);
  const file = files.find(file => file.startsWith(username));
  const newFile = `${crypto.randomBytes(24).toString("hex")}.${file.split(".")[1]}`;
  
  const oldPath = `./seeds/profiles/${file}`;
  const newPath = `./data/users/${newFile}`;

  fs.copyFileSync(oldPath, newPath);

  const user = new User({
    username,
    email,
    password: hashedPassword,
    salt,
    bio: `I'm ${username}`,
    image: newFile
  })
  await user.save();

  return console.log(user);
}

async function createArticle(username, postId) {
  const user = await User.findOne({username});

  const files = fs.readdirSync(`./seeds/${username}/`);
  const fileList = files.filter(file => file.startsWith(username + postId));

  const newFiles = fileList.map(file => {
    const newFile = `${crypto.randomBytes(24).toString("hex")}.${file.split(".")[1]}`;
    
    const oldPath = `./seeds/${username}/${file}`;
    const newPath = `./data/articles/${newFile}`;
    fs.copyFileSync(oldPath, newPath);

    return newFile;
  })

  const article = new Article({
    description: `${username}'s photo!`,
    photos: newFiles,
    user: user._id,
    created: Date.now()
  })
  await article.save();

  return console.log(article);
}

async function createFollow(follower, following) {
  const _follower = await User.findOne({username: follower});
  const _following = await User.findOne({username: following});

  const follow = new Follow({
    follower: _follower._id,
    following: _following._id
  })

  await follow.save();

  return console.log(follow);
}

async function createData() {
  try {
    await mongoose.connect(mongoDB);

    await createUser("bunny", "bunny@example.com");
    await createUser("cat", "cat@example.com");
    await createUser("bird", "bird@example.com");
    await createUser("duck", "duck@example.com");
  
    await createUser("dog", "dog@example.com");
    await createUser("pug", "pug@example.com");
    await createUser("quokka", "quokka@example.com");
    await createUser("monkey", "monkey@example.com");
  
    await createFollow("pug", "bunny");
    await createFollow("bunny", "cat");
    await createFollow("bunny", "quokka");
    await createFollow("bunny", "dog");

    await createArticle("bunny", "1")
    await createArticle("bunny", "2")
    await createArticle("bunny", "3")

    await createArticle("cat", "1")
    await createArticle("cat", "2")
    await createArticle("cat", "3")
    await createArticle("cat", "4")

    await createArticle("bird", "1")

    await createArticle("duck", "1")
    await createArticle("duck", "2")
    await createArticle("duck", "3")

    await createArticle("dog", "1")
    await createArticle("dog", "2")
    await createArticle("dog", "3")
    await createArticle("dog", "4")

    await createArticle("pug", "1")
    await createArticle("pug", "2")
    await createArticle("pug", "3")

    await createArticle("quokka", "1")
    await createArticle("quokka", "2")
    await createArticle("quokka", "3")

    await createArticle("monkey", "1")
    await createArticle("monkey", "2")
    await createArticle("monkey", "3");

    mongoose.connection.close();

  } catch (error) {
    console.error(error);
  }
}

createData();