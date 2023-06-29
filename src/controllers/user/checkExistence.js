const checkExistence = async (req, res) => {
  const { User } = req.db;
  const { username, email } = req.body;
  const user = await User.findByUsernameOrEmail(username, email);

  if (user) {
    let message = '';
    // if (user.username === username) message += 'Username is already in use. ';
    // if (user.email === email) message += 'Email is already in use.';
    if(user.username === username && user.email === email) message = 'Both email and username are already in use';
    else{
        if (user.username === username) message += 'Username is already in use. ';
        if (user.email === email) message += 'Email is already in use.';
    }
    res.send({ message });
  } else {
    res.send('');
  }
};

module.exports = checkExistence;
