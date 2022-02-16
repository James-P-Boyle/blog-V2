const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
require("dotenv").config();
const cors = require("cors");

const homeStartingContent =
  "About lorem Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia, inventore Aliquid itaque recusandae doloribus rem sed veniam quam";
const aboutContent =
  "About lorem Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia, inventore Aliquid itaque recusandae doloribus rem sed veniam quam";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/* mongoose
  .connect("mongodb://localhost:27017/wbsDB", { useNewUrlParser: true })
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.log("Connection error", err);
    process.exit;
  }); */

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.log("Connection error", err);
    process.exit;
  });

app.use(cors());

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  post.save(function (err) {
    res.redirect("/");
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact");
});

/* thank you page on form submisson */
app.get("/thankYou", function (req, res) {
  res.render("thankYou");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server is up and running on port 3000");
});
/* v */
/* Post.deleteOne({ title: "__" }, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Succesfully delted");
  }
}); */
