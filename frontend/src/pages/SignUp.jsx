import { useContext, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import * as BulmaToast from "bulma-toast";
import CurrentUserContext from "../contexts/current-user-context";
import { createUser } from "../adapters/user-adapter";

// Controlling the signup form is a good idea because we want to adde (eventually)
// more validation and provide real time feedback to the user about usernames and passwords
export default function SignUpPage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [errorText, setErrorText] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // We could also use a single state variable for the form data:
  // const [formData, setFormData] = useState({ username: '', password: '' });
  // What would be the pros and cons of that?

  if (currentUser) return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {};
    for (const [key, value] of formData.entries()) {
      userData[key] = value;
    }
    const [user, error] = await createUser(userData);
    if (error) return setErrorText(error.statusText);

    setCurrentUser(user);

    // Add a success toast notification
    BulmaToast.toast({
      message: "You've successfully signed up!",
      type: "is-success",
      position: "top-center",
      dismissible: true,
      pauseOnHover: true,
    });

    navigate('/');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'username') setUsername(value);
    if (name === 'password') setPassword(value);
  };

  return <>
    <div id='logInContainer'>
      <div id='signUpBox'>
        <form onSubmit={handleSubmit} onChange={handleChange} id='logInForm'>
          <h1 className='title has-text-centered'>Sign Up</h1>
          <label htmlFor="first_name">First Name</label>
          <input
            autoComplete="off"
            type="text"
            id="first_name"
            name="first_name"
            required
            className='input'
          // onChange={handleChange}
          // value={username}
          />
          <label htmlFor="last_name">Last Name</label>
          <input
            autoComplete="off"
            type="text"
            id="last_name"
            name="last_name"
            required
            className='input'
          // onChange={handleChange}
          // value={username}
          />
          <label htmlFor="email">Email</label>
          <input
            autoComplete="off"
            type="email "
            id="email"
            name="email"
            required
            className='input'
          // onChange={handleChange}
          // value={username}
          />
          <label htmlFor="username">Username</label>
          <input
            autoComplete="off"
            type="text"
            id="username"
            name="username"
            onChange={handleChange}
            value={username}
            required
            className='input'
          />

          <label htmlFor="password">Password</label>
          <input
            autoComplete="off"
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            value={password}
            required
            className='input'
          />

          <button className='button is-rounded mb-3 is-custom' type='submit'>Sign Up Now!</button>
          {!!errorText && <p>{errorText}</p>}
          <p className="has-text-centered">Already have an account with us? <Link to="/login">Log in!</Link></p>
        </form>
      </div>
    </div>
  </>;
}
