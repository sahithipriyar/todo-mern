const userInfo = require("./modals/user-modal")

const checkExistingUser = async (username) => {
       let existingUser = false;
       await userInfo.find({ username: username }).then((userData) => {
              if (userData.length) {
                     existingUser = true;

              }
       });
       return existingUser;
}



module.exports = {checkExistingUser};