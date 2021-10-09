//need both Thought and User models
const { User, Thought } = require('../models');

const thoughtController = {
  //** /api/thoughts
  // get all thoughts: GET /api/thoughts
  getAllThought(req, res) {
    Thought.find({})
      .select('-__v')
      //to sort in DESC order by the _id value
      .sort({ _id: -1 })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one thought by id: GET /api/thoughts/:id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .select('-__v')
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // add thought: create a new thought 
  // **don't forget to push the created thought's _id to the associated user's thoughts array field
  createThought({ params, body }, res) {
      Thought.create(body)
        .then(({ _id }) => {
          console.log(_id)
          return User.findOneAndUpdate(
              { _id: params.userId },
              //$push to add the thought's '_id' to the specific user we're updating
              //same as javascript, this method adds data to an array
              { $push: { thoughts: _id } },
              { new: true }
            );
          })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No thought found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
  },    

  // update thought by id: PUT /api/thoughts/:id
  updateThought({ params, body }, res) {
    // add 'runValidators' to validate input set in thought model
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true  })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  // remove thought:
  deleteThought({ params }, res) {
      Thought.findOneAndDelete({ _id: params.id })
        .then(deletedThought  => {
            if (!deletedThought) {
              return res.status(404).json({ message: 'No thought found with this id!' });
              return;
            }
              res.json(deletedThought);
            })
            .catch(err => res.json(err));
  },

  //** /api/thoughts/:thoughtId/reactions
  // add reaction: create a reaction stored in a single thought's reactions array field
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
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

  // remove reaction: pull and remove a reaction by the reaction's reactionId value
  removeReaction({ params }, res) {
    Thought.findOneAndDelete(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
      )
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  }

}

module.exports = thoughtController;