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
  const [hero, setHero] = useState();
  const [players, setPlayers] = useState([]);
  const [game, setGame] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

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
    socket.on("game", (game) => {
      setPlayers(game.players);
      setGame(game);
    });

    return () => {
      socket.off("game");
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

  const handleCreate = (data, e) => {
    e.preventDefault();
    const room = chance.word();
    socket.auth = { username: data.username, room, admin: true };
    socket.connect();
  };

  const handleJoin = (data, e) => {
    e.preventDefault();
    socket.auth = {
      username: data.username,
      room: data.room.toLowerCase(),
      admin: false,
    };
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
          <Game
            hero={hero}
            players={players}
            handleLogoff={handleLogoff}
            game={game}
            socket={socket}
          />
        )}
        {!loggedIn && !loading && (
          <>
            <Tabs setCreatorMode={setCreatorMode} creatorMode={creatorMode} />
            {creatorMode ? (
              <CreateGame handleCreate={handleCreate} />
            ) : (
              <JoinGame handleJoin={handleJoin} />
            )}
          </>
        )}
        {loading && <p>Loading...</p>}
      </div>
    </main>
  );
}
