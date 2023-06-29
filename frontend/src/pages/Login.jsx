import { useContext, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import * as BulmaToast from "bulma-toast";
import { logUserIn, logUserOut } from "../adapters/auth-adapter";
import CurrentUserContext from "../contexts/current-user-context";

export default function LoginPage() {
  const navigate = useNavigate();
  const [errorText, setErrorText] = useState('');
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorText("");
    const formData = new FormData(event.target);
    const [user, error] = await logUserIn(
      Object.fromEntries(formData.entries()),
    );
    if (error) {
      setErrorText("User not found");
      return;
    }

    setCurrentUser(user);

    BulmaToast.toast({
      message: `Logged in!`,
      type: "is-success",
      position: "top-center",
      dismissible: true,
      pauseOnHover: true,
    });

    navigate(`/`);
  };

  if (currentUser) return <Navigate to="/" />;

  return (
    <div id="logInContainer">
      <div id='logInBox'>
        <form onSubmit={handleSubmit} id="logInForm">
          <h1 className="title has-text-centered">Log In</h1>
          <div id='errorTextDiv'>
            <label className="is-size-5" htmlFor='username'>Username</label>
            {!!errorText && <p className="has-text-danger">{errorText}</p>}
          </div>
          <input type="text" className='input is-medium' placeholder="Username" id='username' name='username'></input>
          <label className="is-size-5" htmlFor='password'>Password</label>
          <input type="password" className='input is-medium' id='password' name='password' placeholder="Password"></input>
          <button type='submit' className="button logInButton mb-2 is-rounded is-custom">Log In</button>
          <p className="has-text-centered">Don't have an account? Click here to <Link to="/sign-up">Sign Up!</Link></p>
        </form>
      </div>
    </div>
  );
}
