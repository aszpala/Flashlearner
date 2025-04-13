import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../styles/style.css';
import axios from 'axios';

const ProfilePage = () => {

  const { userId } = useParams();

  const navigate = useNavigate();

  const [scores, setScores] = useState({});

  const [error, setError] = useState('');

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    sets: [],
  });


  useEffect(() => {
    fetchUserData();
    fetchScores(userId);
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/users/userssets/${userId}`);
      if (response.status === 200) {
        const { user, sets } = response.data;
        console.log("Uzytkownik:", user);
        console.log("Lista setow:", sets);
        setUserData({ ...user, sets });
      } else if (response.status === 304) {
        console.log("304");
      }
    } catch (error) {
      console.error("Bład:", error);
      setError("Bład podczas pobierania danych użytkownika");
    }
  };

  const fetchScores = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5001/users/${userId}/getpoints`);
      console.log("Wyniki:", response.data);
      const scoresMap = response.data.reduce((map, score) => ({
        ...map,
        [score.set_id]: score
      }), {});
      console.log("Wyniki:", scoresMap);
      setScores(scoresMap);
    } catch (error) {console.error('Błąd:', error);}
  };



  const handleDeleteSet = async (setId) => {
    try {
      const response = await axios.delete(`http://localhost:5001/sets/delete/set/${setId}`);
      if (response.status === 200){
        console.log('Usunięto set z fiszkami');
        window.location.reload();
      }
    } catch (error) {console.error('Bład:', error);}
  };

  const handleSetClick = (id) => {navigate(`/study-set/${id}`);};

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
                <img src="/images/log.png" alt="lightning" /> Flashlearner
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
              <li>
                <a href={`/profile-page/${userId}`}>Profile</a>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          {error && <p className="error">{error}</p>}
          <section className="info">
            <h2>Welcome, {userData.username}</h2>
            <p>Email: {userData.email}</p>
          </section>

          <section>
            <h2>Your Flashcard Sets</h2>
            <div className="sets-list-personal">
              {userData.sets.length > 0 ? (
                  userData.sets.map((set) => (
                      <div className="set-personal" key={set.id}>
                        <span onClick={() => handleSetClick(set.id)}>{set.name}</span>
                        {scores[set.id] && (
                            <span className="scoress">{scores[set.id].points}/{scores[set.id].total}</span>
                        )}
                        <div>
                          <button onClick={() => window.location.href = `/edit-set/${set.id}`}>
                            <img src="/images/edit2.png" alt="edit" className="img-button"/>
                          </button>
                          <button onClick={() => handleDeleteSet(set.id)}>
                            <img src="/images/trash.png" alt="delete" className="img-button"/>
                          </button>
                        </div>
                      </div>
                  ))
              ) : (
                  <p>No sets created yet</p>
              )}
            </div>
            <button onClick={() => window.location.href = '/create-set'}>
              <img src="/images/plus.png" alt="add set" className="img-button"/>
            </button>
          </section>
        </main>

        <footer>
          <p>Train your memory smarter with Flashlearner</p>
        </footer>
      </div>
  );
};

export default ProfilePage;