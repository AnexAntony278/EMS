import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { LoginHero, SignupHero } from './components/hero-page-contents'

import './style.css'

export const AuthPage = ({ authmode }) => {
    const [pageMode, setPageMode] = useState(authmode);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupUsername, setSignupUsername] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupRole, setSignupRole] = useState('user');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const togglePageMode = () => {
        if (pageMode == 'signupMode') {
            setErrorMessage(''); setSignupUsername('');
            setSignupEmail('');
            setSignupPassword('');
            setSignupConfirmPassword('');
            setErrorMessage('');
            setPageMode('loginMode');
        } else {
            setPageMode('signupMode');
            setLoginEmail('');
            setLoginPassword('');
        }
        setErrorMessage('')
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!loginEmail.trim()) {
            setErrorMessage('e-mail is required.');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(loginEmail)) {
            setErrorMessage('enter a valid e-mail address.');
        }
        if (!loginPassword.trim()) {
            setErrorMessage('password is required.');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword,
                }),
            });
            const token = await response.text();
            if (response.status === 200) {
                localStorage.setItem('token', token);
                navigate('/home');
            } else if (response.status === 401) {
                setErrorMessage('invalid email or password');
            } else {
                setErrorMessage();
            }
        } catch (error) {
            setErrorMessage('Something went wrong!');
        }
    }
    const handleSignup = async (e) => {
        e.preventDefault();
        if (!signupUsername.trim()) {
            setErrorMessage('username is required.');
            return;
        }
        if (!signupEmail.trim()) {
            setErrorMessage('e-mail is required.');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(signupEmail)) {
            setErrorMessage('enter a valid e-mail address.');
            return;
        }
        if (signupPassword.length < 8) {
            setErrorMessage('password must be at least 8 characters long.');
            return;
        }
        if (signupPassword !== signupConfirmPassword) {
            setErrorMessage('passwords do not match.');
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: signupUsername,
                    email: signupEmail,
                    password: signupPassword,
                    role: signupRole,
                }),
            });

            if (response.status === 200) {
                const token = await response.text();
                localStorage.setItem('token', token);
                navigate('/home');
            } else if (response.status === 409) {
                setErrorMessage('User already exists with this e-mail address.');
            } else {
                setErrorMessage('Signup failed, please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Something went wrong during signup!');
        }
    }
    return (
        <div className='App'>
            <div className={`hero-frame centered ${pageMode === 'loginMode' ? 'move-right' : pageMode === 'signupMode' ? 'move-left' : ''}`}>
                {(pageMode === 'signupMode') ?
                    <SignupHero /> : <LoginHero />
                }
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <div className="login-frame centered">
                    <form>
                        <h1>Welcome Back!</h1>
                        <label htmlFor="login-email">E-Mail</label>
                        <input type="email" id="login-email" value={loginEmail} onChange={(e) => { setLoginEmail(e.target.value) }} />
                        <label htmlFor="login-password" >Password</label>
                        <input type="password" id="login-password" value={loginPassword} onChange={(e) => { setLoginPassword(e.target.value) }} />
                        <p className="error-message">{errorMessage}</p>
                        <div style={{
                            display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between"
                        }}>
                            <button type='submit' onClick={(e) => { handleLogin(e) }}><h3>Sign In</h3></button>
                            <a href='#' onClick={togglePageMode}>Register {'>>'}</a>
                        </div>
                    </form>
                </div>
                <div className="signup-frame centered">
                    <form>
                        <h1>Create Account</h1>
                        <label htmlFor="signup-username">User Name</label>
                        <input type="text" id="signup-username" value={signupUsername} onChange={(e) => { setSignupUsername(e.target.value) }} />
                        <label htmlFor="signup-email">E-Mail</label>
                        <input type="email" id="signup-email" value={signupEmail} onChange={(e) => { setSignupEmail(e.target.value) }} />
                        <label htmlFor="signup-password">Password</label>
                        <input type="password" id="signup-password" value={signupPassword} onChange={(e) => { setSignupPassword(e.target.value) }} />
                        <label htmlFor="signup-confirm-password">Confirm Password</label>
                        <input type="password" id="signup-confirm-password" value={signupConfirmPassword} onChange={(e) => { setSignupConfirmPassword(e.target.value) }} />
                        <p className="error-message">{errorMessage}</p>
                        <div style={{
                            display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between"
                        }}>
                            <button type='submit' onClick={(e) => { handleSignup(e) }}><h3>Register</h3></button>
                            <a href="#" onClick={togglePageMode}>{'<<'} Login</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
