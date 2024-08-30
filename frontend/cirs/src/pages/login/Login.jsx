import React, {useState } from 'react';
import './Login.css';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset_password_reset } from '../../features/user';
import { Link } from 'react-router-dom';

function Login() {
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        const newErrors = {};
        if (!loginData.username.trim()) {
            newErrors.username = "Username is required";
        }
        if (!loginData.password.trim()) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const dispatch = useDispatch();
    const { user, error } = useSelector(state => state.user);
    const [loginData, setLoginData] = useState({ username: "", password: "",user_type:'citizen' });

    const reachGoogle = async () => {
        const client_id = '1013654891852-1nbqppqitq2d6r1bft65grcur39lg1na.apps.googleusercontent.com';
        const callBackURI = 'http://localhost:3000';
        

        try {
            
            window.location.replace(`https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${callBackURI}&prompt=consent&response_type=code&client_id=${client_id}&scope=openid%20email%20profile&access_type=offline`);
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            dispatch(login({ loginData }));
        }
    };

    const handleResetFp = (e) => {
        dispatch(reset_password_reset());
    };

    if (user) {
        return <Navigate to="/" />;
    }

    return (
        <div className='login-container'>
            <div className='login-box'>
                <h2>USER LOGIN</h2>
                <form>
                    <div className="input-field">                       
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={loginData.username}
                            onChange={handleInputChange}
                        />
                    </div>
                    {!error && errors.username && <div className="error">{errors.username}</div>}

                    <div className="input-field">
                       
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={loginData.password}
                            onChange={handleInputChange}
                        />
                    </div>
                    {!error && errors.password && <div className="error">{errors.password}</div>}
                    {error && <div className="error">{error.detail}</div>}

                    <div className="forgot-password">
                        Lost password? <Link to='/forgot_password' onClick={handleResetFp}>Click Here</Link>
                    </div>

                    <button type="submit" className="login-button" onClick={handleSubmit}>Login</button>

                    <p className="or">Or login using</p>
                    <div className="alt-login">
                        <div className="google" onClick={reachGoogle}></div>
                    </div>
                    
                    {/* Add Member Login Button */}
                    <div className="member-login-button">
                        <Link to='/member_login'>Staff Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
