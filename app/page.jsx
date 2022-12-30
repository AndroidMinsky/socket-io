"use client";

import { useState, useEffect } from "react";
import { Chance } from "chance";

import Game from "./Game";
import Tabs from "./Tabs";
import CreateGame from "./CreateGame";
import JoinGame from "./JoinGame";

import socket from "../socket";
const chance = new Chance();

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [creatorMode, setCreatorMode] = useState(false);
  const [hero, setHero] = useState({});
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.on("session", ({ sessionID, userID }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.userID = userID;
      setLoggedIn(true);
    });

    return () => {
      socket.off("session");
    };
  }, [socket, players]);

  useEffect(() => {
    socket.on("users", (users) => {
      setPlayers(users);
    });

    return () => {
      socket.off("users");
    };
  }, [socket]);

  useEffect(() => {
    setHero(players.find((user) => user.userID === socket.userID));
  }, [socket, players]);

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
    const room = chance.last({ nationality: "en" });
    socket.auth = { username: username.value, room, admin: true };
    socket.connect();
  };

  const handleJoin = (e) => {
    e.preventDefault();
    socket.auth = { username: username.value, room: room.value, admin: false };
    socket.connect();
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
