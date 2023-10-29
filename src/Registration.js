import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Registration() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [role, setRole] = useState('User'); // Default role is User
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const navigate = useNavigate();


  const handleRegistration = async () => {
    // Ensure that the password and repeated password match
    if (password !== repeatPassword) {
      alert('Password and repeated password do not match.');
      return;
    }

    if (!agreeTerms) {
      alert('Please agree to the terms of service.');
      return;
    }
    const userData = {
      username,
      email,
      password,

      role,
    };

    const registrationEndpoint = role === 'Admin' ? '/register/admin' : '/register/user';

    try {
        const response = await axios.post(`http://127.0.0.1:5000${registrationEndpoint}`, userData);
  
        if (response.status === 201) {
          setRegistrationStatus('success');
          navigate('/registration-success'); // Use navigate to redirect to the success page
        } else {
          setRegistrationStatus('failure');
        }
      } catch (error) {
        console.error('Registration failed', error);
        setRegistrationStatus('failure');
      }
    }

  return (
    <section className="vh-100" style={{ backgroundColor: '#eee' }}>
      <div className="container h-1000">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: '25px' }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>
                    <form className="mx-1 mx-md-4">
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="text"
                            id="form3Example1c"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                          <label className="form-label" htmlFor="form3Example1c">
                            Username
                          </label>
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="email"
                            id="form3Example3c"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <label className="form-label" htmlFor="form3Example3c">
                            Your Email
                          </label>
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="password"
                            id="form3Example4c"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <label className="form-label" htmlFor="form3Example4c">
                            Password
                          </label>
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="password"
                            id="form3Example4cd"
                            className="form-control"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                          />
                          <label className="form-label" htmlFor="form3Example4cd">
                            Repeat your password
                          </label>
                        </div>
                      </div>

                      <div className="form-check d-flex justify-content-center mb-4">
                        <input
                          className="form-check-input me-2"
                          type="checkbox"
                          value={agreeTerms}
                          id="form2Example3c"
                          onChange={() => setAgreeTerms(!agreeTerms)}
                        />
                        <label className="form-check-label" htmlFor="form2Example3c">
                          I agree all statements in <a href="#!">Terms of service</a>
                        </label>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-users fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <select
                            className="form-select"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                          >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                          </select>
                          <label className="form-label">Select Role</label>
                        </div>
                      </div>

                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button type="button" className="btn btn-primary btn-lg" onClick={handleRegistration}>
                          Register
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                      className="img-fluid"
                      alt="Sample image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


export default Registration;
