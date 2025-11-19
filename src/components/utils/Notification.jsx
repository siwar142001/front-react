import { IoMdCloseCircleOutline } from "react-icons/io";
import { useEffect, useState } from "react";

export default function Notification({ text, active, setActive }) {
    useEffect(() => {const timer = setTimeout(() => {
        setActive(false);
    }, 5000);

    return () => clearTimeout(timer) }, []);

        const [show, setShow] = useState(false);

        // Show the notification when active
        useEffect(() => {
            if (active) {
            setShow(true);
            }
        }, [active]);

    return (
    <>

      {/* Notification box */}
      <div className={`fixed top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                      bg-white text-gray-800 p-6 rounded-xl shadow-xl z-50
                      animate-fade-in flex flex-row vertical-center text-2xl
                      transition-transform duration-300 ease-in-out
                    ${show ? "translate-y-0 opacity-100" : "-translate-y-40 opacity-0"}`}>
        <p>{text}</p>
        <button
          onClick={() => setActive(false)}
        >
          <IoMdCloseCircleOutline className="size-7.5 ml-4 text-red-500"/>
        </button>
      </div>
    </>
  );
}
