import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { connect } from "react-redux";
import { logout } from "../actions/index";

const NavLink = styled(Link)`
  font-size: 1.2rem;
  font-weight: bold;
  color: #fd8c25 !important;
  &.text-primary:hover {
    color: #9c1b4a !important;
  }
`

const TitleHide = styled.span`
  @media (max-width: 375px) {
    display: none;
  }
`

export const NavigationBar = ({isLogin,logout}) => {
  const [show, setShow] = useState(false)
  const [showLangSwitch, setShowLangSwitch] = useState(false)
  const { t, i18n } = useTranslation('navbar')
  return (
    <header>
      <div className="container">
        <nav className="navbar navbar-expand-lg no-gutters">
          <div className="col-3 text-left">
            <NavLink className="navbar-brand text-primary" to="/">
              <img
                src="/img/logo.jpg"
                alt="Encarnacion"
                style={{ width: 150, paddingRight: 15 }}
              />
               <TitleHide>{t('selfReportingTitle')}</TitleHide>
            </NavLink>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav4"
            aria-controls="navbarNav4"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setShow(!show)}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div
            className={`collapse navbar-collapse justify-content-center col-md-8 ${
              show ? 'show' : ''
            }`}
            id="navbarNav4"
          >
            <ul className="navbar-nav ml-auto">
               <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/"
                  onClick={() => setShow(false)}
                >
                  {t('home')}
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/report"
                  onClick={() => setShow(false)}
                >
                  {t('selfReporting')}
                </Link>
              </li>{
                
              }

              {
                isLogin?
                <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/admin"
                  onClick={() => setShow(false)}
                >
                  {t('Survey')}
                </Link>
              </li>:''       
              }
              {
                isLogin?
                <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/score"
                  onClick={() => setShow(false)}
                >
                  {t('score')}
                </Link>
              </li>:''       
              }
              {
                isLogin?
                  <li className="nav-item">
                  <span
                    className="nav-link"     
                    onClick={() => logout()}
                  >
                    {t('logout')}
                  </span>
                </li>:
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/login"
                    onClick={() => setShow(false)}
                  >
                    {t('login')}
                  </Link>
                </li>                
              }

              
            </ul>
          </div>
        </nav>
      </div>
    </header>
  )
}
const mapStateToProps = state => ({
  isLogin: state.auth.isLogin
});

const mapDispatchToProps = { logout };

export default connect( mapStateToProps, mapDispatchToProps)(NavigationBar);