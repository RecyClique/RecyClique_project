const multer = require("multer");
const express = require("express");
const { parser } = require("./utils/cloudinary");
const userController = require("./controllers/user");
const eventController = require("./controllers/event");
const userEventsController = require("./controllers/user_events");
const addModels = require("./middleware/add-models");
const checkAuthentication = require("./middleware/check-authentication");

const Router = express.Router();
Router.use(addModels);

// User routes
Router.get("/users", userController.list);
Router.get("/users/:id", userController.show);
Router.post("/users", userController.create);
Router.patch("/users/:id", checkAuthentication, userController.update);
Router.post("/login", userController.login);
Router.delete("/logout", userController.logout);
Router.get("/me", userController.showMe);
Router.post('/users/check-existence', userController.checkExistence);

Router.get("/logged-in-secret", checkAuthentication, (req, res) => {
  res.send({ msg: "The secret is: there is no secret." });
});

// Event routes
Router.get("/events", eventController.list);
Router.post(
  "/events",
  parser.single("image"),
  eventController.create,
);
Router.patch("/events/:id", eventController.update);
Router.delete("/events/:id", eventController.deleteEvent);

// User event routes
Router.get("/users/:id/joinedEvents", userEventsController.listJoined);
Router.get("/users/:id/createdEvents", userEventsController.listCreated);
Router.delete(
  "/users/:userId/events/:eventId",
  userEventsController.deleteUserEvent,
);
Router.post("/users/:userId/events/:eventId", userEventsController.create);

module.exports = Router;
