export default function Game({ hero, players, handleLogoff }) {
  return (
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
  );
}
