import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Spin } from 'antd';
import './App.css';

const Main = lazy(() => import('./pages/Main'));
const PublicPhone = lazy(() => import('./pages/PublicPhone'));
const ManagerPeople = lazy(() => import('./pages/ManagerPeople'));
const FormPeople = lazy(() => import('./pages/FormPeople'));

export default function Routes() {
  return (
    <>
      <Router>
        <Suspense
          fallback={
            <div key="spinner" className="spinner">
              <Spin size="large" />
            </div>
          }
        >
          <Switch>
            <Main>
              <Route exact path="/" component={PublicPhone} />
              <Route path="/gerenciapessoa" component={ManagerPeople} />
              <Route path="/pessoa" component={FormPeople} />
            </Main>
          </Switch>
        </Suspense>
      </Router>
    </>
  );
}