import React from 'react';
import GlobalStyle from './GlobalStyle';
import Header from './common/Header';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Wiki from './pages/Wiki';
import Gallery from './pages/Gallery';
import SignIn from './pages/SignIn';
import LogIn from './pages/LogIn';

import { useRecoilState } from 'recoil';
import { UserId } from './utils/recoil';

const App: React.FC = () => {
    const [userId, setUserId] = useRecoilState(UserId);

    console.log(userId);

    return (
        <BrowserRouter>
            <GlobalStyle />
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/wiki" element={<Wiki />}></Route>
                    <Route path="/gallery" element={<Gallery />}></Route>
                    <Route path="/signin" element={<SignIn />}></Route>
                    <Route path="/login" element={<LogIn />}></Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;
