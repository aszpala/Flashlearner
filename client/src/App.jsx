import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/style.css';
import HomePage from './pages/HomePage.jsx';
import CreateSetPage from './pages/CreateSetPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import EditSetPage from './pages/EditSetPage.jsx';
import StudySetPage from './pages/StudySetPage.jsx';
import LogInPage from './pages/LogInPage.jsx';
import SignInPage from './pages/SignInPage.jsx';


function App() {
        return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<div>Page Not Found</div>} />
                <Route path="/profile-page/:userId" element={<ProfilePage />} />
                <Route path="/create-set" element={<CreateSetPage />} />
                <Route path="/edit-set/:idSetu" element={<EditSetPage />} />
                <Route path="/study-set/:id" element={<StudySetPage />} />
                <Route path="/sign-in-page" element={<SignInPage />} />
                <Route path="/log-in-page" element={<LogInPage />} />
            </Routes>
        </Router>
    );
}

export default App;
