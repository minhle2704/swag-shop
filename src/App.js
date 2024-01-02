import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";

import Container from "@mui/material/Container";
import MyCart from "./component/SwagManagement/MyCart";
import CheckOut from "./component/SwagManagement/CheckOut";
import Header from "./component/Header";
import SwagCardContainer from "./component/SwagManagement/SwagCardContainer";
import SwagDialog from "./component/SwagManagement/SwagDialog";
import MyOrder from "./component/UserManagement/MyOrder";
import SignUp from "./component/UserManagement/SignUp";
import MyProfile from "./component/UserManagement/MyProfile";
import ChangePassword from "./component/UserManagement/ChangePassword";
import SendTemporaryPassword from "./component/UserManagement/SendTemporaryPassword";
import ResetPassword from "./component/UserManagement/ResetPassword";
import SignIn from "./component/UserManagement/SignIn";

function App() {
  const [user, setUser] = useState(null);
  const [swagData, setSwagData] = useState([]);
  const [swagOrders, setSwagOrders] = useState({});
  const [shouldOpenAddSwagDialog, setShouldOpenAddSwagDialog] = useState(false);
  const [orderData, setOrderData] = useState([]);

  const { pathname } = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      return;
    }

    if (
      pathname !== "/sign-up" &&
      pathname !== "/sign-in" &&
      pathname !== "/forget-password" &&
      pathname !== "/reset-password"
    ) {
      navigate("/sign-in");
    }
  }, [navigate, pathname]);

  const saveUserToLocalStorage = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  };

  useEffect(() => {
    const fetchSwagData = async () => {
      const response = await fetch("/.netlify/functions/swags");
      const data = await response.json();
      const result = data.message;

      setSwagData(result);
    };

    const fetchSwagOrder = async () => {
      const payload = { userId: user.id };
      const response = await fetch("/.netlify/functions/get-cart-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      const result = JSON.parse(data.message);
      setSwagOrders(result);
    };

    if (user) {
      fetchSwagData();
      fetchSwagOrder();
    }
  }, [user]);

  const handleClickOpenAddSwagDialog = () => {
    setShouldOpenAddSwagDialog(true);
  };

  const handleCloseAddSwagDialog = () => {
    setShouldOpenAddSwagDialog(false);
  };

  const clearSwagOrders = async () => {
    const payload = { userId: user.id, swagOrders: {} };
    const response = await fetch("/.netlify/functions/record-cart-items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200) {
      setSwagOrders({});
    }
  };

  const decreaseSwagOrder = (id) => {
    setSwagOrders({
      ...swagOrders,
      [id]: { ...swagOrders[id], quantity: swagOrders[id].quantity - 1 },
    });
  };

  const increaseSwagOrder = (id) => {
    setSwagOrders({
      ...swagOrders,
      [id]: { ...swagOrders[id], quantity: swagOrders[id].quantity + 1 },
    });
  };

  const removeSwagOrder = async (id) => {
    const newSwagOrders = { ...swagOrders };
    delete newSwagOrders[id];

    const payload = { userId: user.id, swagOrders: newSwagOrders };
    const response = await fetch("/.netlify/functions/record-cart-items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status) {
      setSwagOrders(newSwagOrders);
    }
  };

  // Record customer order in cart
  const updateSwagOrders = async (swag, quantity) => {
    const id = swag.ref["@ref"].id;
    const name = swag.data.name;

    let updatedSwagOrders;
    if (swagOrders[id]) {
      updatedSwagOrders = {
        ...swagOrders,
        [id]: { ...swagOrders[id], quantity },
      };
    } else {
      updatedSwagOrders = { ...swagOrders, [id]: { id, name, quantity } };
    }

    const payload = { userId: user.id, swagOrders: updatedSwagOrders };
    const response = await fetch("/.netlify/functions/record-cart-items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status) {
      setSwagOrders(updatedSwagOrders);
    }
  };

  const postSwagOrdersInCart = () => {
    const payload = { userId: user.id, swagOrders };
    fetch("/.netlify/functions/record-cart-items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  };

  // Clear everything before logout
  const resetData = () => {
    setUser(null);
    setSwagData([]);
    setSwagOrders({});
    setOrderData([]);
    localStorage.clear();
  };

  return (
    <Container>
      <Header
        user={user}
        swagOrders={swagOrders}
        handleClickOpenAddSwagDialog={handleClickOpenAddSwagDialog}
        postSwagOrdersInCart={postSwagOrdersInCart}
        resetData={resetData}
      />

      <Routes>
        <Route
          path="/sign-in"
          element={
            <SignIn
              setUser={setUser}
              saveUserToLocalStorage={saveUserToLocalStorage}
              setSwagOrders={setSwagOrders}
            />
          }
        ></Route>

        <Route
          path="/sign-up"
          element={
            <SignUp
              setUser={setUser}
              saveUserToLocalStorage={saveUserToLocalStorage}
            />
          }
        ></Route>

        <Route
          path="/"
          element={
            <SwagCardContainer
              user={user}
              swagData={swagData}
              swagOrders={swagOrders}
              setSwagData={setSwagData}
              updateSwagOrders={updateSwagOrders}
            />
          }
        ></Route>

        <Route
          path="/my-cart"
          element={
            <MyCart
              swagOrders={swagOrders}
              decreaseSwagOrder={decreaseSwagOrder}
              increaseSwagOrder={increaseSwagOrder}
              removeSwagOrder={removeSwagOrder}
            />
          }
        ></Route>

        <Route
          path="/check-out"
          element={
            <CheckOut
              user={user}
              swagOrders={swagOrders}
              clearSwagOrders={clearSwagOrders}
            />
          }
        ></Route>

        <Route path="/my-profile" element={<MyProfile user={user} />}></Route>

        <Route
          path="/change-password"
          element={<ChangePassword user={user} />}
        ></Route>

        <Route
          path="/forget-password"
          element={<SendTemporaryPassword />}
        ></Route>

        <Route path="/reset-password" element={<ResetPassword />}></Route>

        <Route
          path="/my-order"
          element={
            <MyOrder
              user={user}
              orderData={orderData}
              setOrderData={setOrderData}
            />
          }
        ></Route>
      </Routes>

      {shouldOpenAddSwagDialog && (
        <SwagDialog
          swagData={swagData}
          setSwagData={setSwagData}
          onClose={handleCloseAddSwagDialog}
        />
      )}
    </Container>
  );
}
export default App;
