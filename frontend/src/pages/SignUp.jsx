import { useContext, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import * as BulmaToast from "bulma-toast";
import CurrentUserContext from "../contexts/current-user-context";
import { createUser } from "../adapters/user-adapter";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { userNameAndEmailChecker } from "../adapters/user-adapter";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [errorText, setErrorText] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function checkPasswordStrength(password) {
    const minLength = 7;
    const checks = [
      () => password.length >= minLength || `Password is too short. It should be at least ${minLength} characters.`,
      () => /\d/.test(password) || 'Password should have at least one digit.',
      () => /[A-Z]/.test(password) || 'Password should have at least one uppercase letter.',
      () => /[a-z]/.test(password) || 'Password should have at least one lowercase letter.',
      () => /[!@#$%^&*()-+=.]/.test(password) || 'Password should have at least one of the symbols !@#$%^&*()-+=.',
    ];
    for (let i = 0; i < checks.length; i++) {
      const result = checks[i]();
      if (typeof result === 'string') {
        return result;
      }
    }
    return false;
  }

  if (currentUser) return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {};
    for (const [key, value] of formData.entries()) {
      userData[key] = value;
    }
    let exist = await userNameAndEmailChecker(userData)
    console.log(exist)
    if(exist[0].message !== 'Success') return setErrorText(exist[0].message);

    const passwordStrength = checkPasswordStrength(userData.password);
    if (passwordStrength) return setErrorText(passwordStrength);
    if (userData.password !== userData.confirm_password) return setErrorText('Confirm Password Does Not Match');
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <div id='logInContainer'>
        <div id='signUpBox'>
          <form onSubmit={handleSubmit} onChange={handleChange} id='logInForm'>

            <h1 className='title has-text-centered mt-3'>Sign Up</h1>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <div>
                <label htmlFor="first_name">First Name</label>
                <input
                  autoComplete="off"
                  type="text"
                  id="first_name"
                  name="first_name"
                  required
                  className='input'
                />
              </div>

              <div>
                <label htmlFor="last_name">Last Name</label>
                <input
                  autoComplete="off"
                  type="text"
                  id="last_name"
                  name="last_name"
                  required
                  className='input'
                />
              </div>
            </div>

            <label htmlFor="email">Email</label>
            <input
              autoComplete="off"
              type="email"
              id="email"
              name="email"
              required
              className='input'
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

            <div style={{display:'flex', justifyContent:'space-between'}}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <label htmlFor="password">Password</label>
                  <span className="icon is-small is-right" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                
                <input
                  autoComplete="off"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  onChange={handleChange}
                  value={password}
                  required
                  className='input'
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <label htmlFor="confirm_password">Confirm Password</label>
                  <span className="icon is-small is-right" onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer' }}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <input
                  autoComplete="off"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm_password"
                  name="confirm_password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className='input'
                />
              </div>
              
            </div>
            {!!errorText && <p className="has-text-danger mb-1">{errorText}</p>}
            <button className='button is-rounded mb-3 is-custom' type='submit'>Sign Up Now!</button>
            <p className="has-text-centered">Already have an account with us? <Link to="/login">Log in!</Link></p>
          </form>
        </div>
      </div>
    </>
  );
}
