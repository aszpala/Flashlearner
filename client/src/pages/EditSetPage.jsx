import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../styles/style.css';

const EditSetPage = () => {

  const {idSetu} = useParams(); //z url id setu

  const userId = localStorage.getItem('userId');

  const [newWord, setNewWord] = useState({word: "", translation: ""});

  const [setError] = useState('');

  const [isLoggedIn] = useState(false);

  const [setDetails, setSetDetails] = useState({
    setName: "",
    language: "",
    translation: "",
    status: "",
    words: [],
  });

  useEffect(() => {fetchSetData();}, [idSetu]);

  const fetchSetData = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/sets/list/${idSetu}`);
      if (response.status === 200) {
        console.log("Fetched set details:", response.data);
        setSetDetails({
          ...response.data,
          words: response.data.flashcards
        });
      } else if (response.status === 304) {
        console.log("Data not modified");
      }
    } catch (error) {
      console.error("Error fetching set data:", error);
      setError("Error fetching set data");
    }
  };

  const handleAddWord = async (e) => {
    e.preventDefault();
    if (newWord.word.trim() && newWord.translation.trim()) {
      try {
        const response = await axios.post(`http://localhost:5001/sets/flashcard/${idSetu}`, newWord);
        if (response.status === 201) {
          setSetDetails((prevDetails) => ({
            ...prevDetails,
            words: [...(prevDetails.words || []), newWord], // Ensure words is an array
          }));
          setNewWord({word: "", translation: ""});
        }
      } catch (error) {
        console.error("Error adding flashcard:", error);
        setError("Error adding flashcard");
      }
    }
  }

  const handleDeleteWord = async (wordToDelete) => {
    try {
      const response = await axios.delete(`http://localhost:5001/sets/delete/${wordToDelete.id}`);
      if (response.status === 200) {
        setSetDetails((prevDetails) => ({
          ...prevDetails,
          words: prevDetails.words.filter(word => word.id !== wordToDelete.id), //jak sie usunie pomyslnie z bazy to tez w widoku
        }));
      }
    } catch (error) {
      console.error("Bład:", error);
      setError("Bład przy usuwaniu fiszki !");
    }
  };



  const handleInputChange = (e) => {
      const {name, value} = e.target;
      setNewWord({...newWord, [name]: value});
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
            <section>
              <div>
              <h2>Set Name: <span>{setDetails.setName}</span></h2>
                <p>Language: {setDetails.language} | Translation: {setDetails.translation}</p>
                <p>Status: {setDetails.status}</p>
              </div>

              <div className="words-list">
                <h3>Words in this Set:</h3>
                <ul>
                  {setDetails.words && setDetails.words.map((wordPair, index) => (
                      <li key={index}>
                        {wordPair.word} - {wordPair.translation}
                        <button onClick={() => handleDeleteWord(wordPair)}><img src="/images/trash.png" alt="delete"
                                                                                className="img-button"/></button>
                      </li>
                  ))}
                </ul>
              </div>

              <div className="add-word">
                <h3>Add New Word</h3>
                <form onSubmit={handleAddWord} className="add-word-form">
                  <div className="form-group">
                    <label htmlFor="word">Word to translate</label>
                    <input
                        type="text"
                        id="word"
                        name="word"
                        placeholder="Enter new word"
                        value={newWord.word}
                        onChange={handleInputChange}
                        required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="translation">Translation</label>
                    <input
                        type="text"
                        id="translation"
                        name="translation"
                        placeholder="Enter translation"
                        value={newWord.translation}
                        onChange={handleInputChange}
                        required
                    />
                  </div>

                  <div className="form-group">
                    <button type="submit">
                      <img
                          src="/images/plus.png"
                          alt="add word"
                          className="img-button"
                      />
                    </button>
                  </div>
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

export default EditSetPage;