import { useEffect, useState } from 'react';
import '../styles/style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const [publicSets, setPublicSets] = useState([]);
  const [filteredSets, setFilteredSets] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scores, setScores] = useState({});
  const [filters, setFilters] = useState({
    language: 'all',
    search: ''
  });

  //paginacje dodalam
  const [currentPage, setCurrentPage] = useState(1);
  const setsPerPage = 3;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token) { setIsLoggedIn(true); }
    if (userId) { fetchScores(userId); }
    fetchSets();
  }, []);

  const fetchSets = async () => {
    try {
      const response = await axios.get('http://localhost:5001/sets/sets/public');
      setPublicSets(response.data);
      setFilteredSets(response.data);
    } catch (error) {
      console.error('Error:', error);
      setPublicSets([]);
      setFilteredSets([]);
    }
  };

  const fetchScores = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5001/users/${userId}/getpoints`);
      const scoresMap = {};
      response.data.forEach(score => {
        scoresMap[score.set_id] = score;
      });
      setScores(scoresMap);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  const handleSetClick = (id) => { navigate(`/study-set/${id}`); };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((previousFilters) => ({
      ...previousFilters,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const filtered = publicSets.filter((set) => {
      const matchesLanguage = filters.language === 'all' || set.language.toLowerCase() === filters.language.toLowerCase();
      const matchesSearch = set.name.toLowerCase().includes(filters.search.toLowerCase());
      return matchesLanguage && matchesSearch;
    });
    setFilteredSets(filtered);
    setCurrentPage(1); // wroc na strone 1 przy uzywaniu filtra
  };

  //ktore na stronie
  const indexOfLastSet = currentPage * setsPerPage;
  const indexOfFirstSet = indexOfLastSet - setsPerPage;
  const currentSets = filteredSets.slice(indexOfFirstSet, indexOfLastSet);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                  {isLoggedIn ? (<button onClick={handleLogout}>Log Out</button>) : (<a href="/log-in-page">Log In</a>)}
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
          <section className="baner">
            <h1>Can&apos;t find what you&apos;re looking for in public sets?</h1>
            <h4>Register and create your own sets!</h4>
            <a href="/sign-in-page">
              <button>Get Started</button>
            </a>
          </section>

          <section className="public">
            <div className="box">
              <div className="filters">
                <h3>Filters</h3>
                <form onSubmit={handleFilterSubmit}>
                  <label htmlFor="language">Language:</label>
                  <select id="language" name="language" value={filters.language} onChange={handleFilterChange}>
                    <option value="all">All</option>
                    <option value="english">English</option>
                    <option value="german">German</option>
                    <option value="spanish">Spanish</option>
                    <option value="polish">Polish</option>
                    <option value="other">Other</option>
                  </select>

                  <label htmlFor="search">Search:</label>
                  <input type="text" id="search" name="search" placeholder="Search set" value={filters.search}
                         onChange={handleFilterChange}/>

                  <button type="submit">Apply</button>
                </form>
              </div>

              <div className="sets-list">
                {Array.isArray(currentSets) && currentSets.map((item, index) => (
                    <div className="set" key={index}>
                      <span onClick={() => handleSetClick(item.id)}>  {item.name}  </span>
                      {isLoggedIn && scores[item.id] && (
                          <span className="score">  {scores[item.id].points}/{scores[item.id].total}  </span>
                      )}
                    </div>
                ))}
              </div>


            </div>
          </section>
          <div className="pagination">
            {Array.from({length: Math.ceil(filteredSets.length / setsPerPage)}, (_, index) => ( //ceil zaokraglenie
                <button key={index + 1} onClick={() => paginate(index + 1)}>
                  {index + 1}
                </button>
            ))}
          </div>
        </main>

        <footer>
          <p>Train your memory smarter with Flashlearner</p>
        </footer>
      </div>
  );
};

export default HomePage;