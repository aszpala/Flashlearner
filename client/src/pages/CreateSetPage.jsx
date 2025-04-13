import { useState } from "react";
import axios from "axios";
import '../styles/style.css';

const CreateSetPage = () => {

  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId');

  const [isLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    setName: "",
    setLanguage: "English",
    setTranslation: "English",
    setStatus: "public",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // zeby reload sie nie robil
    const userId = localStorage.getItem('userId');
    const updatedFormData = { ...formData, user_id: userId }; //dodaje do formData user_id z local storage

    try {
      const response = await axios.post('http://localhost:5001/sets/sets', updatedFormData);

      if (response.status === 201) {
        const setId = response.data.setId;
        window.location.href = `/edit-set/${setId}`; //przekierowanie na edit odrazu dla tego id
      }
    } catch (error) {
      console.error("Error creating set:", error);
      setError("Error creating set");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
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
                  <button onClick={handleLogout}>Log Out</button>
                </li>
              </ul>
            </div>
            <ul className="bottom-links">
              <li>
                <a href="/">Home</a>
              </li>
              <li className={isLoggedIn ? '' : 'hidden_menue'}>
                <a href={`/profile-page/${userId}`}>Profile</a>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          <section className="create-set">
            <div>
              <h1>Create a new flashcard set</h1>
              {error && <p className="error">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="set-name">Set Name:</label>
                  <input
                      type="text"
                      id="set-name"
                      name="setName"
                      placeholder="Enter set name"
                      value={formData.setName}
                      onChange={handleChange}
                      required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="set-language">Language:</label>
                  <select
                      id="set-language"
                      name="setLanguage"
                      value={formData.setLanguage}
                      onChange={handleChange}
                      required
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Polish">Polish</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="set-translation">Translation:</label>
                  <select
                      id="set-translation"
                      name="setTranslation"
                      value={formData.setTranslation}
                      onChange={handleChange}
                      required
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Polish">Polish</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="set-status">Status:</label>
                  <select
                      id="set-status"
                      name="setStatus"
                      value={formData.setStatus}
                      onChange={handleChange}
                      required
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <button type="submit">
                  Create Set
                </button>
              </form>
            </div>
          </section>
        </main>

        <footer>
          <p>Train your memory smarter with Flashlearner</p>
        </footer>
      </div>
  );
};

export default CreateSetPage;