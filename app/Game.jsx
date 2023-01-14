"use client";

import WordInput from "./WordInput";
import { Chance } from "chance";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

const chance = new Chance();

export default function Game({ hero, players, handleLogoff, game, socket }) {
  const [hiddenWord, setHiddenWord] = useState(true);
  const handleStart = (e) => {
    e.preventDefault();
    socket.emit("start", game.roomID);
  };

  const handleWord = ({ word }, e) => {
    e.preventDefault();
    const impostors = players.filter((player) => player.userID !== hero.userID);
    if (impostors.length > 0) {
      const impostor = chance.pickone(impostors);
      socket.emit("word", { word, impostor });
    } else {
      toast.error("Let's wait for more players", {
        icon: "😅",
        style: {
          borderRadius: "30px",
          background: "#3d465e",
          color: "#F5A4A4",
        },
      });
    }
  };

  const handleRestart = (e) => {
    e.preventDefault();
    socket.emit("restart", game.roomID);
  };

  const handleEnd = (e) => {
    e.preventDefault();
    socket.emit("end", game.roomID);
  };

  const handleNext = (e) => {
    e.preventDefault();
    socket.emit("next", game.roomID);
  };

  const handleHiddenWord = () => {
    console.log("Started");
  };

  const handleActivePLayer = (playerID) => {
    if (hero.admin) {
      if (!game.impostor) {
        socket.emit("change-active", playerID);
      } else {
        toast.error("Not a good idea", {
          icon: "😎",
          style: {
            borderRadius: "30px",
            background: "#3d465e",
            color: "#F5A4A4",
          },
        });
      }
    } else {
      return;
    }
  };

  return (
    // Header
    <div className="drop-shadow-clay">
      <div
        className="card mb-8
                [ p-[30px] rounded-[45px] ] 
                [ bg-[#3d465e] shadow-clay-card ]"
      >
        {hero && (
          <div className="flex justify-between gap-5">
            <div className="flex items-center">
              <Image
                src={`/images/avatars/${hero.avatar}.png`}
                width={41}
                height={50}
                alt="detective club"
                priority
                className="rounded-[25px]"
              />
              <p className="text-white ml-4">
                Hi <span className="font-bold">{hero.username}</span>!
              </p>
            </div>
            <div className="flex items-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl border border-transparent bg-[#698a87] px-4 py-2 font-medium text-white shadow-sm hover:bg-[#566D6B] focus:outline-none "
                onClick={handleLogoff}
              >
                Exit
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Players Section */}
      <div>
        <h1 className="text-white font-bold mb-4 text-center text-lg	">
          Players
        </h1>
        <div className="flex flex-row gap-5 justify-center flex-wrap">
          {hero &&
            players.map((player) => (
              <div
                className="text-white text-center flex flex-col relative"
                key={player.userID}
                onClick={() => handleActivePLayer(player.userID)}
              >
                {player.admin && (
                  <Image
                    src={"/images/crown.png"}
                    width={25}
                    height={25}
                    alt="crown"
                    className={`place-self-center absolute -top-4 ${
                      player.userID !== game.activePlayer ? "brightness-50" : ""
                    }`}
                  />
                )}
                <div
                  className={`card 
              [ p-[10px] rounded-[25px] ] 
              [ bg-[#3d465e] shadow-clay-card  ${
                player.userID === game.activePlayer
                  ? "border-2 border-[#8bbbb4]"
                  : ""
              } ]`}
                >
                  <Image
                    src={`/images/avatars/${player.avatar}.png`}
                    width={62}
                    height={80}
                    alt="detective club"
                    priority
                    className={`rounded-[15px] ${
                      player.userID !== game.activePlayer ? "brightness-50" : ""
                    }`}
                  />
                  <span
                    className={`text-center ${
                      player.userID !== game.activePlayer
                        ? "brightness-75 text-center"
                        : ""
                    }`}
                  >
                    {player.username}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* Main Section */}
      <div
        className="card mt-8
                [ p-[30px] rounded-[45px] ] 
                [ bg-[#3d465e] shadow-clay-card ] 
                [ flex items-center flex-col text-white ]"
      >
        {hero && (
          <div>
            <p>
              Room ID : <span className="font-bold">{hero.room}</span>
            </p>
            {hero.admin && !game.started && !game.word && (
              <button
                className="my-6 inline-flex w-full items-center justify-center rounded-2xl border border-transparent bg-[#698a87] px-4 py-2 font-medium text-white shadow-sm hover:bg-[#566D6B] focus:outline-none "
                onClick={handleStart}
              >
                Start
              </button>
            )}
          </div>
        )}
        {!hero?.admin && !game.started && !game.word && (
          <p className="my-6">Waiting for the game to start...</p>
        )}

        {hero?.userID === game.activePlayer && game.started && !game.word && (
          <WordInput handleWord={handleWord} />
        )}
        {hero?.userID !== game.activePlayer && game.started && !game.word && (
          <p className="my-6">Waiting for the word...</p>
        )}
        {game.started && game.word && (
          <div className="text-center">
            {socket.userID === game.impostor ? (
              <p
                className="my-8 text-center text-3xl"
                onTouchStart={handleHiddenWord}
                onTouchEnd={() => console.log("Ended")}
              >
                {hiddenWord ? "*****" : "Impostor"}
              </p>
            ) : (
              <p className="my-8 text-center text-3xl">
                {" "}
                {hiddenWord ? "*****" : game.word}
              </p>
            )}
            <button
              className="inline-flex  items-center justify-center rounded-2xl border border-transparent bg-[#698a87] px-4 py-2 font-medium text-white shadow-sm hover:bg-[#566D6B] focus:outline-none"
              onPointerEnter={() => setHiddenWord(false)}
              onPointerLeave={() => setHiddenWord(true)}
              onTouchStart={() => setHiddenWord(false)}
              onTouchEnd={() => setHiddenWord(true)}
            >
              Show Word
            </button>
            {hero?.admin && (
              <div>
                <button
                  className="mt-10 inline-flex w-full items-center justify-center rounded-2xl border border-transparent bg-[#698a87] px-4 py-2 font-medium text-white shadow-sm hover:bg-[#566D6B] focus:outline-none"
                  onClick={handleRestart}
                >
                  Restart
                </button>
                <button
                  className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-transparent bg-[#698a87] px-4 py-2 font-medium text-white shadow-sm hover:bg-[#566D6B] focus:outline-none"
                  onClick={handleEnd}
                >
                  End Game
                </button>
              </div>
            )}
          </div>
        )}
        {!game.started && game.word && (
          <div className="my-8 ">
            <p className="text-xl text-center	">
              Word: <span className="font-bold">{game.word}</span>
            </p>
            <p className="text-xl text-center	">
              Impostor:{" "}
              <span className="font-bold">
                {(players &&
                  players.find((player) => player.userID === game.impostor)
                    ?.username) ||
                  "chicken"}
              </span>
            </p>
            {hero?.admin ? (
              <button
                className="mt-8 inline-flex w-full items-center justify-center rounded-2xl border border-transparent bg-[#698a87] px-4 py-2 font-medium text-white shadow-sm hover:bg-[#566D6B] focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleNext}
              >
                Next Round
              </button>
            ) : (
              <p className="mt-8">Waiting for the next round...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
