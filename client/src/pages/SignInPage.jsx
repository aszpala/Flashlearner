import { useState } from 'react';
import '../styles/style.css';
import axios from 'axios';

const SignInPage = () => {

  const [username, setUsername] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/users/register', {
        username,
        email,
        password
      });
      setSuccess(response.data);
      setError('');
    } catch (err) {
      setError(err.response.data);
      setSuccess('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    window.location.href = '/';
  };


  return (
      <div>
        <header>
          <nav>
            <div className="top">
              <div className="logo">
                <img src="/images/log.png" alt="lightning"/> Flashlearner
              </div>
              <ul className="logIn-link">
                <li>
                  {isLoggedIn ? (
                      <button onClick={handleLogout}>Log Out</button>
                  ) : (
                      <a href="/log-in-page">Log In</a>
                  )}
                </li>
              </ul>
            </div>
            <ul className="bottom-links">
              <li>
                <a href="/">Home</a>
              </li>
              <li className={isLoggedIn ? '' : 'hidden_menue'}>
                <a href="/profile-page">Profile</a>
              </li>
            </ul>
          </nav>
        </header>

        <main className="form-page">
          <form onSubmit={handleSubmit}>
            <h2>Create Account</h2>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <br/>
            <br/>
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <br/><br/>
            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <br/><br/>
            <button type="submit">Register</button>
          </form>
        </main>

        <footer>
          <p>Train your memory smarter with Flashlearner</p>
        </footer>
      </div>
  );
};

export default SignInPage;