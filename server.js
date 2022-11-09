const express = require("express");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const app = express();
const port = 3000;

const onePostView = async (postId) => {
  try {
    const data = await fetch(
      `https://cachyserverdev.cachy.com/cachy/v1/post/viewpost/${postId}`
    ).then((data) => {
      return data.json();
    });

    return data;
  } catch (error) {
    return error;
  }
};

app.get("/feed/:postId", async function (req, res) {
  const filePath = path.resolve(__dirname, "./public", "index.html");
  let postId = req.params.postId;
  if (postId) {
    const postData = await onePostView(postId);
    fs.readFile(filePath, "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      }

      data = data.replace(
        /{{title}}/,
        `${postData.data?.firstName + " "}${postData.data?.lastName}`
      );
      data = data.replace(/{{description}}/, `${postData.data?.metadata}`);

      res.send(data);
    });
  }
});

app.use(express.static(path.resolve(__dirname, "./public")));
app.listen(port, () => console.log(`Listening on port ${port}`));
