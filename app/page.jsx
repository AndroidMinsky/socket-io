"use client";

import { useState, useEffect } from "react";
import { Chance } from "chance";
import Image from "next/image";
import { ColorRing } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";

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
  }, [socket]);

  useEffect(() => {
    socket.on("game", (game) => {
      setGame(game);
    });

    return () => {
      socket.off("game");
    };
  }, [socket]);

  useEffect(() => {
    setPlayers(game.players);
  }, [game]);

  useEffect(() => {
    setHero(players?.find((user) => user.userID === socket.userID));
  }, [socket, players]);

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
      setLoggedIn(true);
    }
  }, [socket]);

  useEffect(() => {
    socket.on("admin-left", () => {
      socket.emit("logoff");
      socket.disconnect();
      localStorage.removeItem("sessionID");
      setLoggedIn(false);
      toast.error("Admin has left the room", {
        icon: "😭",
        style: {
          borderRadius: "30px",
          background: "#3d465e",
          color: "#F5A4A4",
        },
      });
    });

    return () => {
      socket.off("admin-left");
    };
  }, [socket]);

  const handleCreate = (data, e) => {
    e.preventDefault();
    const room = chance.word();
    const avatar = chance.integer({ min: 1, max: 20 });
    socket.auth = { username: data.username, room, admin: true, avatar };
    socket.connect();
  };

  const handleJoin = (data, e) => {
    e.preventDefault();
    const avatar = chance.integer({ min: 1, max: 20 });
    socket.auth = {
      username: data.username,
      room: data.room.toLowerCase().trim(),
      admin: false,
      avatar,
    };
    socket.connect();
  };

  const handleLogoff = (e) => {
    e.preventDefault();
    socket.emit("logoff", hero);
    socket.disconnect();
    localStorage.removeItem("sessionID");
    setLoggedIn(false);
  };

  return (
    <main>
      <Toaster position="bottom-center" reverseOrder={false} />
      <div className="flex flex-col items-center justify-center h-screen">
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
            <div>
              <Image
                src={"/images/detective.png"}
                width={270}
                height={250}
                alt="detective club"
                priority
              />
            </div>
            <div className="drop-shadow-clay">
              <div
                className="card 
                [ p-[50px] max-w-lg rounded-[45px] ] 
                [ bg-[#3d465e] shadow-clay-card ] 
                [ flex items-center gap-5 flex-col ]"
              >
                <Tabs
                  setCreatorMode={setCreatorMode}
                  creatorMode={creatorMode}
                />
                {creatorMode ? (
                  <CreateGame handleCreate={handleCreate} />
                ) : (
                  <JoinGame handleJoin={handleJoin} />
                )}
              </div>
            </div>
          </>
        )}
        {loading && (
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#8bbbb4", "#8bbbb4", "#8bbbb4", "#8bbbb4", "#8bbbb4"]}
          />
        )}
      </div>
    </main>
  );
}
