const express = require("express");
const app = express();
const port = 3001;

const cors = require("cors");

const {
  addUser,
  generateVotePoint,
  writePost,
  writeComment,
  votePost,
  writeTags,
  deletePost,
  deleteVotedPost,
  deleteTagCount,
  deleteComment,
  toggleSolve,
  toggleStar,
  readNotification,
  notifyPublisher,
  deleteZeroTagCount,
  updateUserData,
  addProfanity,
  deleteProfanity,
} = require("./firebase-config");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/addUser", async (req, res) => {
  // functional, add new user to the database
  await addUser({ email: req.body.email, name: req.body.name })
    .then(() => {
      console.log(`${req.body.email} has logged in`);
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.post("/updateUserData", async (req, res) => {
  // functional, add new user to the database
  await updateUserData({
    userId: req.body.userId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthday: req.body.birthday,
    college: req.body.college,
    program: req.body.program,
    userAgreedSLA: req.body.userAgreedSLA,
  })
    .then((result) => {
      res.send(result);
      console.log(`${req.body.userId}'s User data has been updated`);
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.post("/generateVotePoint", async (req, res) => {
  await generateVotePoint()
    .then((result) => {
      res.send(result);
      console.log("Vote Point Generation Success!");
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.post("/writePost", async (req, res) => {
  await writePost({
    category: req.body.category,
    isAnonymous: !!req.body.isAnonymous,
    message: req.body.message,
    userId: req.body.userId,
    tags: req.body.tags,
  })
    .then((result) => {
      res.send(result);
      console.log("A post has been written");

      generateVotePoint()
        .then(() => {
          console.log("Vote Point Generation Success!");
        })
        .catch((error) => {
          console.log(error.message);
        });

      writeTags({ tags: req.body.tags })
        .then(() => {
          console.log("Tags has been written successfully");
        })
        .catch((error) => {
          console.log(error.message);
        });
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.post("/writeComment", async (req, res) => {
  await writeComment({
    postId: req.body.postId,
    reply: req.body.reply,
    userId: req.body.userId,
  })
    .then((result) => {
      res.send(result);
      console.log("A comment has been written");

      generateVotePoint()
        .then(() => {
          console.log("Vote Point Generation Success!");
        })
        .catch((error) => {
          console.log(error.message);
        });
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.post("/votePost", async (req, res) => {
  await votePost({
    voteType: req.body.voteType,
    userId: req.body.userId,
    postId: req.body.postId,
    weight: req.body.weight,
  })
    .then((result) => {
      res.send(result);
      console.log(`A post has been voted (${req.body.voteType})`);

      generateVotePoint()
        .then(() => {
          console.log("Vote Point Generation Success!");
        })
        .catch((error) => {
          console.log(error.message);
        });
    })
    .catch((error) => {
      res.send(error.message);
      console.log(error.message);
    });
});

app.post("/deletePost", async (req, res) => {
  await deletePost({ postId: req.body.postId })
    .then((result) => {
      res.send(result);
      console.log(`A post has been deleted`);

      deleteVotedPost({ userId: req.body.userId, postId: req.body.postId })
        .then(() => {
          console.log("Voted Post Data has been deleted");
        })
        .catch((error) => {
          console.log(error.message);
        });

      deleteTagCount({ tags: req.body.tags })
        .then(() => {
          console.log("Tag Count Decremented Successfully");
        })
        .catch((error) => {
          console.log(error.message);
        });

      deleteZeroTagCount()
        .then(() => {
          console.log(
            "Tag Count with zero values has been deleted Successfully"
          );
        })
        .catch((error) => {
          console.log(error.message);
        });
    })
    .catch((error) => {
      console.log(error.message);
      res.send(error.message);
    });
});

app.post("/deleteComment", async (req, res) => {
  await deleteComment({ commentId: req.body.postId })
    .then((result) => {
      res.send(result);
      console.log(`A comment has been deleted`);
    })
    .catch((error) => {
      res.send(error.message);
      console.log(error.message);
    });
});

app.post("/toggleSolve", async (req, res) => {
  await toggleSolve({ isSolved: req.body.isSolved, postId: req.body.postId })
    .then((result) => {
      console.log(`Solved state toggled`);
      res.send(result);
    })
    .catch((error) => {
      res.send(error.message);
      console.log(error.message);
    });
});

app.post("/toggleStar", async (req, res) => {
  await toggleStar({ star: req.body.star, commentId: req.body.commentId })
    .then((result) => {
      console.log(`Toggled Star comment`);
      res.send(result);
    })
    .catch((error) => {
      res.send(error.message);
      console.log(error.message);
    });
});

app.post("/readNotification", async (req, res) => {
  await readNotification({ notificationId: req.body.notificationId })
    .then((result) => {
      console.log(`Notification has been viewed`);
      res.send(result);
    })
    .catch((error) => {
      console.log(error.message);
      res.send(error.message);
    });
});

app.post("/notifyPublisher", async (req, res) => {
  await notifyPublisher({
    notificationType: req.body.notificationType,
    notifier: req.body.notifier,
    postId: req.body.postId,
    userId: req.body.userId,
  })
    .then((result) => {
      console.log(`Notified Publisher`);
      res.send(result);
    })
    .catch((error) => {
      res.send(error.message);
      console.log(error.message);
    });
});

app.post("/addProfanity", async (req, res) => {
  await addProfanity(req.body.profanity, req.body.userId)
    .then((result) => {
      res.send(result);
      console.log(req.body.profanity, ":Added by", req.body.userId);
    })
    .catch((error) => {
      res.send(error.message);
      console.log("error on adding profanity to the database");
    });
});

app.post("/deleteProfanity", async (req, res) => {
  await deleteProfanity(req.body.profanity)
    .then((result) => {
      res.send(result);
      console.log(req.body.profanity, ":Deleted");
    })
    .catch((error) => {
      console.log("error on deleting profanity to the database");
    });
});

app.listen(port, () =>
  console.log(`Haribon Server listening on port ${port}!`)
);
