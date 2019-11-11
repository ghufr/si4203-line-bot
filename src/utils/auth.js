const User = require("../models/User");
const Group = require("../models/Group");

const authenticateUser = UserId => {
  return User.findOne({ UserId })
    .then(res => res)
    .catch(err => {
      console.error(err);
    });
};

// Only registered group will work, manual by admin
const authenticateGroup = GroupId => {
  return Group.findOne({ GroupId })
    .then(res => res)
    .catch(err => {
      console.log(err);
    });
};

module.exports = { authenticateGroup, authenticateUser };
