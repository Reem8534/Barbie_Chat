export default function Navbar() {
  return (
    <div className="fixed bottom-[32px] left-[32px] z-50 w-full md:w-auto" style={{ backgroundColor: "#EC4399" }}>
      <nav>
        <ul className="font-medium flex p-4 md:p-0 mt-4 border border-black rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-black md:dark:bg-black" style={{ backgroundColor: "#EC4399" }}>
          <li>
            <a
              onClick={() => {
                window.open("https://x.com/Barbie798867");
              }}
              className="block cursor-pointer py-2 px-3 text-[#EC4399] rounded   md:border-0  md:p-0 dark:text-white hover:underline font-bold"
            >
              Twitter
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                window.open("https://t.me/My_Barbie0_bot");
              }}
              className="block cursor-pointer py-2 px-3 text-[#EC4399] rounded   md:border-0  md:p-0 dark:text-white hover:underline font-bold"
            >
              Telegram
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
