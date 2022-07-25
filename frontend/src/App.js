import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import Navigation from "./components/Navigation";
import * as sessionActions from "./store/session";
import SpotList from "./components/SpotList";
import SpotDetailPage from "./components/SpotDetailPage/index";
import ManageReviewPage from "./components/ManageReviewPage";
import ManageListingPage from "./components/ManageListingPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <Switch>
        <Route exact path='/'>
          <SpotList />
        </Route>
        <Route path='/spots/:id'>
          <SpotDetailPage />
        </Route>
        <Route path='/users/:id/spots'>
          <ManageListingPage />
        </Route>
        <Route path='/users/:id/reviews'>
          <ManageReviewPage />
        </Route>
      </Switch>
    </>
  );
}

export default App;
