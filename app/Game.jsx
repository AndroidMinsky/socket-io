"use client";

import WordInput from "./WordInput";
import { Chance } from "chance";

const chance = new Chance();

export default function Game({ hero, players, handleLogoff, game, socket }) {
  const handleStart = (e) => {
    e.preventDefault();
    socket.emit("start", game.roomID);
  };

  const handleWord = (e) => {
    e.preventDefault();
    const impostor = chance.pickone(
      players.filter((player) => player.userID !== hero.userID)
    );

    socket.emit("word", { word: word.value, impostor });
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
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      {hero && (
        <div>
          <p>
            Hi {hero.username}, welcome to the {hero.room} room
          </p>
          <p>
            Current Users:{" "}
            {players.map((player, index) => (
              <span
                key={player.userID}
                className={`${player.admin ? "font-bold" : ""} ${
                  player.userID === game.activePlayer ? "italic" : ""
                }`}
                style={{ marginRight: "0.5rem" }}
              >
                {player.username}
              </span>
            ))}
          </p>
          <button
            type="submit"
            className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleLogoff}
          >
            Log Off
          </button>
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
      {!socket.admin && !game.started && !game.word && (
        <p>Waiting for the game to start...</p>
      )}

      {socket.userID === game.activePlayer && game.started && !game.word && (
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
            {players.find((player) => player.userID === game.impostor).username}
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
  );
}
