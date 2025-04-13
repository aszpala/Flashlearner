import { useState, useEffect } from 'react';
import '../styles/style.css';
import axios from 'axios';

function LoginPage() {

  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {setIsLoggedIn(true);}
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username"){setUsername(value);}
    else if (name === "password") {setPassword(value);}
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //zeby strona sie nie przeładowała
    if (!username || !password) {
      setError("Prosze wypełnić każde pole!");
      return;
    }
    try {
      const response = await axios.post('http://localhost:5001/users/login', {
        username,
        password
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      setIsLoggedIn(true);
      window.location.href = `/profile-page/${response.data.userId}`;
    } catch (err) {
      setError("Niepoprawny login lub hasło");
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    window.location.href = '/';
  };



  return (
      <div className="login-page">
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
                <a href={`/profile-page/${localStorage.getItem('userId')}`}>Profile</a>
              </li>
            </ul>
          </nav>
        </header>

        <main className="form-page">
          <form onSubmit={handleSubmit}>
            <h2>Log into your account</h2>

            {error && <p className="error">{error}</p>}

            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleChange}
                required
            />

            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                required
            />

            <button type="submit">Submit</button>

            <p>Don&apos;t have an account? <a href="/sign-in-page">Sign Up</a></p>
          </form>
        </main>

        <footer>
          <p>Train your memory smarter with Flashlearner</p>
        </footer>
      </div>
  );
}

export default LoginPage;