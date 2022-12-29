export default function Tabs({ setCreatorMode, creatorMode }) {
  const tabs = [
    { name: "Join Game", href: "#", current: !creatorMode },
    { name: "Create Game", href: "#", current: creatorMode },
  ];
  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md mb-6">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue={tabs.find((tab) => tab.current).name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="flex space-x-4" aria-label="Tabs">
          <a
            key="Join Game"
            className={`px-3 py-2 font-medium text-sm rounded-md cursor-pointer ${
              !creatorMode
                ? "bg-gray-200 text-gray-800"
                : "text-gray-600 hover:text-gray-800" +
                  "px-3 py-2 font-medium text-sm rounded-md cursor-pointer"
            }`}
            aria-current={!creatorMode ? "page" : undefined}
            onClick={() => setCreatorMode(false)}
          >
            Join Game
          </a>
          <a
            key="Create Game"
            className={`px-3 py-2 font-medium text-sm rounded-md cursor-pointer ${
              creatorMode
                ? "bg-gray-200 text-gray-800"
                : "text-gray-600 hover:text-gray-800" +
                  "px-3 py-2 font-medium text-sm rounded-md cursor-pointer"
            }`}
            aria-current={creatorMode ? "page" : undefined}
            onClick={() => setCreatorMode(true)}
          >
            Create Game
          </a>
        </nav>
      </div>
    </div>
  );
}
