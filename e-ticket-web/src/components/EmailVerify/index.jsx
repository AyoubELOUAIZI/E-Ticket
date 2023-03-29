import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import success from "../../img/success.png";
import "./style.css";
import Eror404 from "../common/eror404";
import logo from "./../../img/logo.svg";

const EmailVerify = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [validUrl, setValidUrl] = useState(false);
  const [typeuser, setTypeuser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { eticketjwt } = useParams();
  const Nav = useNavigate();
  useEffect(() => {
    const verifyEmailUrl = async () => {
      if (eticketjwt === "checkemail") {
        return;
      }
      try {
        const url = `${apiUrl}/api/user/verify-email/${eticketjwt}`;
        const { data } = await axios.get(url, { withCredentials: true });
        if (data) {
          setIsLoading(false);
          setValidUrl(true);
          setTypeuser(data.userType);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    verifyEmailUrl();
  }, [eticketjwt]);

  if (eticketjwt === "checkemail") {
    return (
      <>
        <nav className="nav">
          <div className="nav-container">
            <img src={logo} alt="e-tickets.logo" className="Logo_" />
          </div>
        </nav>
        <div className="check-email">
          <div className="check-email-container">
            <div className="header">Please check your email !</div>
            <div className="info">
              <div className="info-icon">
                <i class="fa-solid fa-inbox"></i>
              </div>
              <div className="info-text">
                {" "}
                We just sent you an email with a verification link. Please check
                your inbox (and spam folder just in case) and click on the link
                to verify your email address. We can't wait to have you onboard
                !
              </div>
            </div>
            <div
              className="btn"
              onClick={() => {
                Nav("/home");
              }}
            >
              <div className="btn-container">Back to Home</div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (isLoading) {
    return (
      <div>
        <nav className="nav">
          <div className="nav-container">
            <img src={logo} alt="e-tickets.logo" className="Logo_" />
          </div>
        </nav>
        <div className="">
          <h1>Loading ...!</h1>
        </div>
      </div>
    );
  } else {
    return (
      <>
        {validUrl ? (
          <>
            <nav className="nav">
              <div className="nav-container">
                <img src={logo} alt="e-tickets.logo" className="Logo_" />
              </div>
            </nav>
            <div className="">
              <img src={success} alt="success_img" className="" />
              <h1>Email verified successfully</h1>
              {typeuser === "client" && (
                <a href="/">
                  {" "}
                  <button className="">Back to Home</button>
                </a>
              )}
              {typeuser === "organizer" && (
                <Link to="/organizer/dashboard">
                  {" "}
                  <button className="">My dashboard</button>{" "}
                </Link>
              )}
            </div>
          </>
        ) : (
          <Eror404 />
        )}
      </>
    );
  }
};

export default EmailVerify;
