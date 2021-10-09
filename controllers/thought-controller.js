//need both Thought and User models
const { User, Thought } = require('../models');

const thoughtController = {
    // add thought to user - add 'params' to relate to which user
    addThought({ params, body }, res) {
        console.log(body);
        Thought.create(body)
          .then(({ _id }) => {
            console.log(_id)
            return User.findOneAndUpdate(
                { _id: params.userId },
                //MongoDB-based built-in functions - $push to add the thought's '_id' to the specific user we're updating
                //same as javascript, this method adds data to an array
                { $push: { thoughts: _id } },
                { new: true }
              );
            })
            .then(dbUserData => {
              if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
              }
              res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },    

    //add replies:
    addReply({ params, body }, res) {
      Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { replies: body } },
        { new: true, runValidators: true }
      )
        .then(dbUserData => {
          if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },
    
    // remove thought:
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
          .then(deletedThought  => {
              if (!deletedThought) {
                return res.status(404).json({ message: 'No Thought found with this id!' });
              }
              return User.findOneAndUpdate(
                  { _id: params.userId },
                  { $pull: { thoughts: params.thoughtId } },
                  { new: true }
                );
              })
              .then(dbUserData => {
                if (!dbUserData) {
                  res.status(404).json({ message: 'No user found with this id!' });
                  return;
                }
                res.json(dbUserData);
              })
              .catch(err => res.json(err));
    },

    // remove reply:
    removeReply({ params }, res) {
      Thought.findOneAndDelete(
        { _id: params.thoughtId },
        // using the MongoDB '$pull' operator to remove the specific reply from the replies array where the replyId matches the value of params.replyId passed in from the route
        { $pull: { replies: { replyId: params.replyId } } },
        { new: true }
        )
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    },
}

module.exports = thoughtController;