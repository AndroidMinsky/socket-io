"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import socket from "../socket";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [hero, setHero] = useState({});
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.on("users", (users) => {
      setPlayers(users);
      setHero(users.filter((player) => player.userID == socket.id)[0]);
    });

    return () => {
      socket.off("users");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("user connected", (user) => {
      const index = players.findIndex(
        (player) => player.userID === user.userID
      );

      if (index === -1) {
        setPlayers((prevState) => [...prevState, user]);
      } else {
        const modifiedArray = players;
        modifiedArray.splice(index, 1, user);
        setPlayers(modifiedArray);
      }
    });

    return () => {
      socket.off("user connected");
    };
  }, [socket, players]);

  useEffect(() => {
    socket.on("user disconnected", (user) => {
      const modifiedArray = players.filter(
        (player) => player.userID !== user.userID
      );
      setPlayers(modifiedArray);
    });

    return () => {
      socket.off("user disconnected");
    };
  }, [socket, players]);

  useEffect(() => {
    socket.on("session", ({ sessionID, userID }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.userID = userID;
    });

    return () => {
      socket.off("session");
    };
  }, [socket]);

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
      setLoggedIn(true);
    }
  }, [socket]);

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
      setLoggedIn(true);
    }
  }, [socket]);

  const handleLogin = (e) => {
    e.preventDefault();
    socket.auth = { username };
    socket.connect();
    setLoggedIn(true);
  };

  const handleLogoff = (e) => {
    e.preventDefault();
    socket.disconnect();
    localStorage.removeItem("sessionID");
    setLoggedIn(false);
  };

  return (
    <main>
      <div className="flex items-center justify-center h-screen ">
        {loggedIn ? (
          <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <p>
              Hero: {hero?.username?.value} Current Users:{" "}
              {players.map((player) => player.username.value)}
            </p>
            <button
              type="submit"
              className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleLogoff}
            >
              Log Off
            </button>
          </div>
        ) : (
          <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Username
              </h3>

              <form
                className="mt-5 sm:flex sm:items-center"
                onSubmit={handleLogin}
              >
                <div className="w-full sm:max-w-xs">
                  <label htmlFor="username" className="sr-only">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="enter username"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Enter
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
