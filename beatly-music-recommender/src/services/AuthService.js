// Example AuthService
function loginUser(username, password) {
    // validate user (you can use UserRepository if needed)
    return { success: true, username };
  }
  
  module.exports = { loginUser };
  