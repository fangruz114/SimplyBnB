import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import Navigation from "./components/Navigation";
import * as sessionActions from "./store/session";
import SpotList from "./components/SpotList";
import SpotDetailPage from "./components/SpotDetailPage/index";
import ManageReviewPage from "./components/ManageReviewPage";
import ManageListingPage from "./components/ManageListingPage";
import BookingConfirmation from "./components/BookingConfirmation";
import ManageBookingList from "./components/ManageBookingList";
import Footer from "./components/Footer/Footer";
import SpotListMap from "./components/SpotList/SpotListMap";

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
        <Route exact path={['/', '/spots']}>
          <SpotList />
        </Route>
        <Route exact path='/spots/map'>
          <SpotListMap />
        </Route>
        <Route exact path='/spots/:id'>
          <SpotDetailPage />
        </Route>
        <Route path='/users/:id/bookings'>
          <ManageBookingList />
        </Route>
        <Route path='/users/:id/spots'>
          <ManageListingPage />
        </Route>
        <Route path='/users/:id/reviews'>
          <ManageReviewPage />
        </Route>
        <Route path='/spots/:spotId/bookings/:id'>
          <BookingConfirmation />
        </Route>
      </Switch>
      <Footer />
    </>
  );
}

export default App;
