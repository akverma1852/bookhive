import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      if (role === 'Admin') {
        navigate('/admin'); // Redirect to the admin page for admin role
      } else {
        navigate('/home'); // Redirect to the home page for the user role
      }
    }
  }, [token, role, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset any previous errors
    setIsLoading(true);

    if (!usernameOrEmail || !password) {
      setError('Please fill in both fields.');
      setIsLoading(false);
      return;
    }

    const loginData = {
      username_or_email: usernameOrEmail,
      password,
      role,
    };

    const loginEndpoint = role === 'Admin' ? '/login/admin' : '/login/user';

    try {
      const response = await axios.post(`http://127.0.0.1:5000${loginEndpoint}`, loginData);

      const newToken = response.data.token;
      setToken(newToken);
      localStorage.setItem('token', newToken);
      localStorage.setItem('role', role); // Store the role in local storage

      console.log('Login successful', response.data);
      if (role === 'Admin') {
        navigate('/admin'); // Redirect to the admin page for the admin role
      } else {
        navigate('/home'); // Redirect to the home page for the user role
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      console.error('Login failed', error);
    } finally {
      setIsLoading(false);
    }
  }


  const handleSignUp = () => {
    navigate('/registration');
  };

  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex align-items-center justify-content-center h-100">
          <div className="col-md-8 col-lg-7 col-xl-6">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="img-fluid"
              alt="Phone image"
            />
          </div>
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <form onSubmit={handleLogin}>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="form-outline mb-4">
                <input
                  type="text"
                  id="form1Example13"
                  className="form-control form-control-lg"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  disabled={isLoading}
                />
                <label className="form-label" htmlFor="form1Example13">
                  Email address or Username
                </label>
              </div>
              <div className="form-outline mb-4">
                <input
                  type="password"
                  id="form1Example23"
                  className="form-control form-control-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <label className="form-label" htmlFor="form1Example23">
                  Password
                </label>
              </div>
              <div className="form-outline mb-4">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-select form-select-lg"
                  disabled={isLoading}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
                <label className="form-label">Select Role</label>
              </div>
              <div className="d-flex justify-content-around align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="form1Example3"
                    disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="form1Example3">
                    Remember me
                  </label>
                </div>
                <a href="#!">Forgot password?</a>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
              </div>
              <button
                className="btn btn-primary btn-lg btn-block"
                style={{ backgroundColor: '#3b5998' }}
                onClick={handleSignUp}
                disabled={isLoading}
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
