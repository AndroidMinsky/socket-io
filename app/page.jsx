"use client";

import { useState, useEffect } from "react";

import Game from "./Game";
import CreateGame from "./CreateGame";

import socket from "../socket";
import Tabs from "./Tabs";
import JoinGame from "./JoinGame";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [creatorMode, setCreatorMode] = useState(false);
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

  const handleCreate = (e) => {
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
      <div className="flex flex-col items-center justify-center h-screen ">
        {loggedIn && (
          <Game hero={hero} players={players} handleLogoff={handleLogoff} />
        )}
        {!loggedIn && (
          <>
            <Tabs setCreatorMode={setCreatorMode} creatorMode={creatorMode} />
            {creatorMode ? (
              <CreateGame handleCreate={handleCreate} />
            ) : (
              <JoinGame />
            )}
          </>
        )}
      </div>
    </main>
  );
}
