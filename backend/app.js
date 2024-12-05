// import express Module

const express = require("express");
// import body-Parser Module
const bodyParser = require("body-parser");

// import bcrypt Module
const bcrypt = require("bcrypt");
// import mongoose Module
const mongoose = require("mongoose");
// import jwt module
const jwt = require("jsonwebtoken");
// import expresse sesion
const session = require("express-session");
// import multer Module
const multer = require("multer");
// import path Model (module interne sana installation)
const path = require("path");
// importation Axios Module
const axios = require("axios");
// creats an expresse application (app)
const app = express();
// connect Mongoose
mongoose.connect("mongodb://127.0.0.1:27017/sport2DB");
// App configuration
// send JSON response from BE=>FE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Security configuration
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-with, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, OPTIONS, PATCH, PUT"
  );

  next();
});
// avatars: shortcut that replace bakend/images
// images: Folder to create under backend
app.use("/avatars", express.static(path.join("backend/images")));
// app.use("/courses", express.static(path.join("backend/courses")));

const MIME_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storageConfig = multer.diskStorage({
  // destination
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE[file.mimetype];
    if (isValid) {
      cb(null, "backend/images");
    }
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const extension = MIME_TYPE[file.mimetype];
    const imgName = name + "-" + Date.now() + "-crococoder-" + "." + extension;
    cb(null, imgName);
  },
});

// Session Configuration
const secretKey = "your-secret-key";
app.use(
  session({
    secret: secretKey,
  })
);
//Models Importation
const Match = require("./models/match");
const Player = require("./models/player");
const Team = require("./models/team");
const User = require("./models/user");
const team = require("./models/team");

// Business logic
// Business Logic : Add Match
app.post("/matches", (req, res) => {
  console.log("Here into BL:Add Match", req.body);
  Team.findById(req.body.teamOneid, req.body.teamTowId).then((team) => {
    console.log("Here matches", team);
    if (!team) {
      res.json({ msg: "team not found" });
    } else {
      let matchObject = new Match({
        idTeamOne: team._id,
        scoreOne: req.body.scoreOne,
        idTeamTow: team._id,
        scoreTow: req.body.scoreTow,
      });
      // let matchObject = new Match(req.body);
      matchObject.save((err, doc) => {
        if (err) {
          res.json({ msg: "Error" });
        } else {
          team.matches.push(doc);
          team.save();
          res.json({ msg: "added with success" });
          // res.json({ msg: "Added Match with success", doc: matchObject });
        }
      });
    }
  });

  // res.json({ message: "Added with success" });
});
// Business Logic : Get All Match
app.get("/matches", (req, res) => {
  console.log("Here into BL: Get All Matches");
  Match.find()
    .populate("idTeamTow")
    .populate("idTeamOne")
    .then((docs) => {
      console.log("Here docs", docs);
      res.json({ matches: docs });
    });
});
// Business Logic :Get Match By Id
app.get("/matches/:id", (req, res) => {
  console.log("Here into BL: Get Match By Id", req.params.id);
  Match.findById(req.params.id).then((doc) => {
    console.log("Here doc", doc);
    res.json({ match: doc });
  });
});
// Business Logic: Delet Match
app.delete("/matches/:id", (req, res) => {
  console.log("Here into BL: Delete Match", req.params.id);
  Match.deleteOne({ _id: req.params.id }).then((response) => {
    console.log("Here response after delet", response);
    if (response.deletedCount == 1) {
      res.json({ message: "deletde with success" });
    } else {
      res.json({ message: "Error" });
    }
  });
});
// Business Loci :Update Match
app.put("/matches", (req, res) => {
  console.log("Here into BL: Update Match", req.body);
  Match.updateOne({ _id: req.body._id }, req.body).then((response) => {
    console.log("Here the response after edit", response);
    if (response.nModified == 1) {
      res.json({ message: "Edit with Success" });
    } else {
      res.json({ message: "Error with Edit" });
    }
  });
  res.json({ message: "update wthi success" });
});
// Business Loigic : Search Match
app.post("/matches/search", (req, res) => {
  console.log("Hera into BL :Search Match", req.body);
  res.json({ status: "ok", T: [{}, {}] });
});

// Business Logic: Add Players

app.post(
  "/players",
  multer({ storage: storageConfig }).single("img"),
  (req, res) => {
    console.log("Here into BL:Add Player", req.body);
    // Team.findMany()
    Team.findById(req.body.teamId).then((team) => {
      console.log("Here team", team);
      if (!team) {
        res.json({ msg: "team not found" });
      } else {
        let player = new Player({
          name: req.body.name,
          position: req.body.position,
          age: req.body.age,
          number: req.body.number,
          idTeam: team._id,
        });
        player.save((err, doc) => {
          if (err) {
            res.json({ msg: "Player not saved" });
          } else {
            // Add player (_id) to team
            team.players.push(doc);
            team.save();
            res.json({ msg: "added with success" });
          }
        });
      }
    });

    // res.json({ message: "Added with success" });
  }
);
// Business Logic : Get All Players
app.get("/players", (req, res) => {
  console.log("Here into BL: Get All Players");
  Player.find()
    .populate("idTeam")
    .then((docs) => {
      console.log("Here the docs", docs);
      res.json({ players: docs });
    });
});
// Business Logic :Get Player By Id
app.get("/players/:id", (req, res) => {
  console.log("Here Into BL: Get Player By Id", req.params.id);
  Player.findById().then((doc) => {
    console.log("Here the doc", doc);
    res.json({ player: doc });
  });
});
// Business Loci :Update Player
app.put("/players", (req, res) => {
  console.log("Here Into BL: Update Player", req.body);
  Player.updateOne({ _id: req.body._id }, req.body).then((response) => {
    console.log("Here the response after Edit", response);
    if (response.nModified == 1) {
      res.json({ message: "Edit withec success" });
    } else {
      res.json({ message: "Error d'edit" });
    }
  });
  req.json({ message: "update with seccess" });
});
// Business Loci :Delet Player
app.delete("/players", (req, res) => {
  console.log("Here Into BL Delete Player", req.params.id);
  Player.deleteOne().then((response) => {
    console.log("Here the response after delet", response);
    if (response.deletedCount == 1) {
      res.json({ msg: "deleted with success" });
    } else {
      res.json({ msg: "error" });
    }
  });
});

// Business Logic Add Team
app.post("/teams", (req, res) => {
  console.log("Here Into BL : Add Team", req.body);
  let teamObj = new Team(req.body);
  teamObj.save((err, doc) => {
    if (err) {
      res.json({ msg: "Error" });
    } else {
      res.json({ msg: "Added with success", doc });
    }
  });
  res.json({ message: "Added with success" });
});
// Business Logic :Get All Team
app.get("/teams", (req, res) => {
  console.log("Here Into BL : Get All Teams");
  Team.find()
    .populate("players")
    .then((docs) => {
      console.log("Here the docs", docs);
      res.json({ teams: docs });
    });
});
// Business Logic :Get Team By Id
app.get("/teams/:id", (req, res) => {
  console.log("Here Into BL: Get Team By Id", req.params.id);
  Team.findById().then((doc) => {
    console.log("Here the doc", doc);
    res.json({ team: doc });
  });
});
// Business Logic :update Team
app.put("/teams", (req, res) => {
  console.log("Here Into BL: Audate Team", req.body);
  Team.updateOne({ _id: req.body._id }, req.body).then((response) => {
    console.log("here the response after Edit", response);
    if (response.nModified == 1) {
      res.json({ message: "Edit with success" });
    } else {
      res.json({ message: "Error d'edit" });
    }
  });
});

// Business Logic :Delet Team
app.delete("/teams", (req, res) => {
  console.log("Here Into BL:Delete Team", req.params.id);
  Team.deleteOne({ _id: req.params.id }).then((response) => {
    console.log("Here the response after delet", response);
    if (response.deletedCount == 1) {
      res.json({ message: "Deleted with success" });
    } else {
      res.json({ message: "error" });
    }
  });
});
// Business Loigic : Search Match
app.post("/teams/search", (req, res) => {
  console.log("Hera into BL :Search Team", req.body);
  res.json({ status: "ok", T: [{}, {}] });
});
// Business Logic :Signup
app.post(
  "/users/signup",
  multer({ storage: storageConfig }).single("img"),
  (req, res) => {
    console.log("Here the response after Signup", req.body);
    bcrypt.hash(req.body.password, 8).then((cryptagePwd) => {
      console.log("Here crypted Pwd", cryptagePwd);

      req.body.password = cryptagePwd;
      if (req.file) {
        req.body.photo = `http://localhost:3000/avatars/${req.file.filename}`;
      } else {
        req.body.photo = `http://localhost:3000/avatars/avatar.jpg`;
      }

      let user = new User(req.body);
      user.save((err, doc) => {
        if (err) {
          res.json({ msg: "Error" });
        } else {
          res.json({ msg: "Added with success", doc: user });
        }
      });
      res.json({ msg: "Added with success" });
    });
  }
);
// Business Logic :Login
app.post("/users/login", (req, res) => {
  // search User By Email

  User.findOne({ email: req.body.email }).then((user) => {
    // User is null (not found)
    if (!user) {
      return res.json({ msg: "Email not found" });
    } else {
      // Email Existe compar Pwd
      bcrypt.compare(req.body.password, user.password).then((pwdCompar) => {
        console.log("pwdCompar", pwdCompar);
        if (!pwdCompar) {
          res.json({ msg: "Check Pwd" });
        } else {
          // If the user is valid, generate a JWT token
          let userToSend = {
            firstName: user.firstName,
            lasttName: user.lastName,
            role: user.role,
            img: user.photo,
          };

          const token = jwt.sign(userToSend, secretKey, {
            expiresIn: "1h",
          });
          res.json({ msg: "Welcome", user: token });
        }
      });
    }
  });
});
//  Business Logic :Search Weather
app.post("/weather", (req, res) => {
  console.log("Here into weather", req.body);
  // communicate withe axios
  let key = "010cf9e796637c9f0906a8363f94443d";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=${key}`;
  axios.get(url).then((apiRespons) => {
    console.log("Here data", apiRespons.data);
    res.json({ data: apiRespons.data });
  });
});

// make app importable froer files
module.exports = app;
