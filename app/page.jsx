"use client";

import { useState, useEffect } from "react";

import Game from "./Game";
import Tabs from "./Tabs";
import CreateGame from "./CreateGame";
import JoinGame from "./JoinGame";

import socket from "../socket";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [creatorMode, setCreatorMode] = useState(false);
  const [hero, setHero] = useState({});
  const [players, setPlayers] = useState([]);

  console.log(socket.userID);

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
    socket.on("users", (users) => {
      setPlayers(users);
      // setHero(users.filter((player) => player.userID == socket.userID)[0]);
    });

    return () => {
      socket.off("users");
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

  const handleCreate = (e) => {
    e.preventDefault();
    socket.auth = { username: username.value, room: "test" };
    socket.connect();
    setLoggedIn(true);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    socket.auth = { username: username.value, room: room.value };
    socket.connect();
    setLoggedIn(true);
  };

  const handleLogoff = (e) => {
    e.preventDefault();
    socket.emit("logoff");
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
              <JoinGame handleJoin={handleJoin} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
