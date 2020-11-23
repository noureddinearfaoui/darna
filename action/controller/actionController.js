const Action = require("../model/action");
const User = require("../../user/model/user");

exports.addAction = (req, res, next) => {
  let idUser = req.headers.iduser;

  User.findById(idUser)
    .then((user) => {
      if (user) {
        const action = new Action({
          ...req.body,
        });
        action.isPublished = false;
        action.admin = user;

        action
          .save()
          .then(() => res.status(200).json(action))
          .catch((error) =>
            res.status(500).json({ message: "error server" + error })
          );
      } else res.status(404).json({ message: "user Non trouvé" });
    })
    .catch((error) => res.status(404).json({ message: "user Non trouvé" }));
};
// Update Action Details
exports.updateActionDetails = (req, res) => {
  Action.findByIdAndUpdate(
    req.headers.id,
    {
      ...req.body,
    },
    { new: true }
  )
    .then((action) => {
      if (!action) {
        return res.status(404).send({
          message: "Action not found",
        });
      }
      res.send(action);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Action not found",
        });
      }
      return res.status(500).send({
        message: "Error updating details",
      });
    });
};

// delete action by id
exports.deleteOneAction = (req, res) => {
  Action.findByIdAndRemove(req.params.id)
    .then((action) => {
      if (!action) {
        return res.status(404).send({
          message: "Action not found",
        });
      }
      res.status(200).send({ message: "Action deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Action not found",
        });
      }
      return res.status(500).send({
        message: "Could not delete action",
      });
    });
};

// Find a single action
exports.getActionDetails = (req, res) => {
  Action.findById(req.params.id)
    .then((action) => {
      if (!action) {
        return res.status(404).send({
          message: "Action not found ",
        });
      }
      res.send(action);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Action not found ",
        });
      }
      return res.status(500).send({
        message: "Error retrieving action details",
      });
    });
};

// Publish action
exports.publishAction = (req, res) => {
  Action.findByIdAndUpdate(
    req.params.id,
    {
      isPublished: req.body.publish,
    },
    { new: true }
  )
    .then((action) => {
      if (!action) {
        return res.status(404).send({
          message: "Action not found",
        });
      }
      res.status(201).send({
        message: "Sucess",
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Action not found",
        });
      }
      return res.status(500).send({
        message: "Error in publishing",
      });
    });
};

exports.getAllActions = (req, res, next) => {
  Action.find()
    .then((actions) => {
      if (actions) {
        res.status(200).json(actions);
      } else res.status(404).json({ message: "Actions not found" });
    })
    .catch((error) => res.status(400).json({ message: "Actions not found" }));
};
