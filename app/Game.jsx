"use client";

import WordInput from "./WordInput";
import { Chance } from "chance";
import Image from "next/image";

const chance = new Chance();

export default function Game({ hero, players, handleLogoff, game, socket }) {
  const handleStart = (e) => {
    e.preventDefault();
    socket.emit("start", game.roomID);
  };

  const handleWord = ({ word }, e) => {
    e.preventDefault();
    const impostor = chance.pickone(
      players.filter((player) => player.userID !== hero.userID)
    );

    socket.emit("word", { word, impostor });
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

  return (
    // Header
    <div className="drop-shadow-clay">
      <div
        className="card mb-8
                [ p-[30px] rounded-[45px] ] 
                [ bg-[#3d465e] shadow-clay-card ]"
      >
        {hero && (
          <div className="flex justify-between">
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
                className="inline-flex items-center justify-center rounded-xl border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleLogoff}
              >
                Log Out
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
        <div className="flex flex-row gap-5">
          {hero &&
            players.map((player) => (
              <div className="mb-10 text-white" key={player.userID}>
                <div
                  className="card 
              [ p-[10px] rounded-[25px] ] 
              [ bg-[#3d465e] shadow-clay-card  ]"
                >
                  <Image
                    src={`/images/avatars/${player.avatar}.png`}
                    width={62}
                    height={80}
                    alt="detective club"
                    priority
                    className="rounded-[15px]"
                  />
                  <span
                    className={`${player.admin ? "font-bold" : ""} ${
                      player.userID === game.activePlayer ? "italic" : ""
                    }`}
                    style={{ marginRight: "0.5rem" }}
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
        className="card 
                [ p-[50px] rounded-[45px] ] 
                [ bg-[#3d465e] shadow-clay-card ] 
                [ flex items-center gap-5 flex-col text-white ]"
      >
        {hero && (
          <div>
            <p>Welcome to the {hero.room} room</p>
            {hero.admin && !game.started && !game.word && (
              <button
                className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleStart}
              >
                Start
              </button>
            )}
          </div>
        )}
        {!hero?.admin && !game.started && !game.word && (
          <p>Waiting for the game to start...</p>
        )}

        {hero?.userID === game.activePlayer && game.started && !game.word && (
          <WordInput handleWord={handleWord} />
        )}
        {hero?.userID !== game.activePlayer && game.started && !game.word && (
          <p>Waiting for the word...</p>
        )}
        {game.started && game.word && (
          <div>
            {socket.userID === game.impostor ? (
              <p>Impostor</p>
            ) : (
              <p>{game.word}</p>
            )}
            {hero?.admin && (
              <div>
                <button
                  className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleRestart}
                >
                  Restart
                </button>
                <button
                  className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleEnd}
                >
                  End Game
                </button>
              </div>
            )}
          </div>
        )}
        {!game.started && game.word && (
          <div>
            <p>Word: {game.word}</p>
            <p>
              Impostor:{" "}
              {
                players.find((player) => player.userID === game.impostor)
                  .username
              }
            </p>
            {hero?.admin ? (
              <button
                className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleNext}
              >
                Next Round
              </button>
            ) : (
              <p>Waiting for the next round to begin</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
