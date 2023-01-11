export default function Tabs({ setCreatorMode, creatorMode }) {
  const tabs = [
    { name: "Join Game", href: "#", current: !creatorMode },
    { name: "Create Game", href: "#", current: creatorMode },
  ];
  return (
    <>
      <div className="black p-2 bg-[#172446] rounded-[45px] border-solid border border-[#999]">
        <nav className="flex space-x-4" aria-label="Tabs">
          <a
            key="Join Game"
            className={`px-4 py-3 font-medium cursor-pointer rounded-[45px] ${
              !creatorMode
                ? "bg-[#565b6d] text-white"
                : "text-[#999] hover:text-white" +
                  "px-4 py-3 font-medium rounded-[45px] cursor-pointer"
            }`}
            aria-current={!creatorMode ? "page" : undefined}
            onClick={() => setCreatorMode(false)}
          >
            Join Game
          </a>
          <a
            key="Create Game"
            className={`px-4 py-3 font-medium  rounded-[45px] cursor-pointer ${
              creatorMode
                ? "bg-[#565b6d] text-white"
                : "text-[#999] hover:text-white" +
                  "px-4 py-3 font-medium  rounded-[45px] cursor-pointer"
            }`}
            aria-current={creatorMode ? "page" : undefined}
            onClick={() => setCreatorMode(true)}
          >
            Create Game
          </a>
        </nav>
      </div>
    </>
  );
}
