import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../styles/style.css';
import axios from "axios";

const StudySetPage = () => {

  const { id } = useParams();

  const [flashcards, setFlashcards] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [showTranslation, setShowTranslation] = useState(false);

  const [learnedWords, setLearnedWords] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    fetchSetData();
  }, [id]);

  const fetchSetData = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/sets/list/${id}`);
      setFlashcards(response.data.flashcards);
    } catch (error) {
      console.error('Bład odczytu setu i jego fiszek:', error);
    }
  };


  const handleMarkAsLearned = () => {
    const currentWord = flashcards[currentIndex];
    if (!learnedWords.includes(currentWord.word)) {
      setLearnedWords([...learnedWords, currentWord.word]);
    }
  };

  const handleNextWord = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setShowTranslation(false);
  };

  const handleShowTranslation = () => {setShowTranslation(true);};

  const handleSaveScore = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const points = learnedWords.length;
    const total = flashcards.length;

    try {
      await axios.post(`http://localhost:5001/users/${id}/points`, {
        userId,
        setId: id,
        points,
        total,
        lastUpdated: new Date().toISOString()
      });
      alert('Zapisano wynik dla tego setu!');
    } catch (error) {
      console.error('Błąd podczas zapisywania:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const currentCard = flashcards[currentIndex];
  const isLearned = learnedWords.includes(currentCard?.word);
  const progress = `${learnedWords.length}/${flashcards.length}`;

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
          <section className="study-set">
            <h1>Study Flashcard Set</h1>

            <div className="study-details">
              <p>
                Set Name: <span>Basic Spanish Vocabulary</span>
              </p>
              <p>
                Progress: <span>{progress}</span>
              </p>
            </div>

            <div id="learned-button">
              <button onClick={handleMarkAsLearned} disabled={isLearned}>
                {isLearned ? "Already Learned" : "Mark as Learned"}
              </button>
            </div>

            {currentCard && (
                <div className="flashcard">
                  <div className="word">
                    <h2>{currentCard.word}</h2>
                  </div>
                  <div className={`translation ${showTranslation ? "" : "hidden"}`}>
                    <h2>{currentCard.translation}</h2>
                  </div>
                  <div className="actions">
                    <button onClick={handleShowTranslation}>Show Translation</button>
                  </div>
                </div>
            )}

            <div id="navigation">
              <div>
                <button onClick={handleNextWord}>Next Word</button>
                </div>
                {isLoggedIn && (
                    <div>
                      <button className="save-score" onClick={handleSaveScore}>Finish and Save Score</button>
                    </div>
                )}
              </div>
          </section>
        </main>

        <footer>
          <p>Train your memory smarter with Flashlearner</p>
        </footer>
      </div>
  );
};

export default StudySetPage;