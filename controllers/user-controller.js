const { User, Thought } = require('../models');

const userController = {
  // get all users: GET /api/users
  getAllUser(req, res) {
    User.find({})
      //Get the full document from a different document.
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .select('-__v')
      //to sort in DESC order by the _id value
      .sort({ _id: -1 })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one user by id: GET /api/users/:id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .select('-__v')
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
},

  // createUser: POST /api/users
  // expect data { "username": "testing", "email": "test@gmail.com" }
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  },

  // update user by id: PUT /api/users/:id
  updateUser({ params, body }, res) {
    // add 'runValidators' to validate input set in User model
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true  })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete user: DELETE /api/users/:id
  deleteUser({ params }, res) {
    // delete the user
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
        }
        
         // remove the user from any friends arrays
         User.updateMany(
            { _id : {$in: dbUserData.friends } },
            { $pull: { friends: params.id } }
        )
        .then(() => {
            // remove any comments from this user
            Thought.deleteMany({ username : dbUserData.username })
            .then(() => {
                res.json({message: "Successfully deleted user"});
            })
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));
  },

  //add friend: add a new friend to a user's friend list - add 'params' to relate to which user
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.id },
      { $push: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .populate({
          path: 'friends', 
          select: ('-__v')
    })
      .select('-__v')
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // remove friend: remove a friend from a user's friend list
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.id },
      { $pull: { friends: params.friendId } },
      { new: true }
      )
      .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({message: 'No user with this id!'});
            return;
        }
        res.json(dbUserData);
    })
      .catch(err => res.status(400).json(err));
  }
};

module.exports = userController;