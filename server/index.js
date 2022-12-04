const express = require("express");
const app = express();
const port = 3001;

const cors = require("cors");

const {
  addUser,
  getPost,
  getMorePost,
  generateVotePoint,
} = require("./firebase-config");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/addUser", async (req, res) => {
  // functional, add new user to the database
  await addUser({ email: req.body.email, name: req.body.name })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error.message);
    });
  //   res.send()
});

app.post("/generateVotePoint", async (req, res) => {
  await generateVotePoint()
    .then((result) => {
      res.send(result);
      // console.log(result);
    })
    .catch((error) => {
      res.send(error.message);
    });
});

// app.post("/getMorePost", async (req, res) => {
//   await getMorePost(req.body.lastDoc)
//     .then((result) => {
//       res.send(result);
//       // console.log(result);
//     })
//     .catch((error) => {
//       res.send(error.message);
//     });
// });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
