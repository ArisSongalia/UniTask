import React, { useState } from "react";
import { NoteEdit, NoteFocus } from "./modal-group/Modal";


function Notes({
  className = "",
  title = "Title",
  message = "Lorem ipsum dolor sit amet consectetur, adipisicing elitdadadad. Delectus, ipsum doloribus maxime maiores quos eius porro quod suscipit autem dolor distinctio aliquid quaerat. Iste, laborum at accusantium ab tempora voluptatum!",
  owner = "You",
  date = "01/01/12",
  file,
  id = "",
}) {
  const [showPopUp, setShowPopUp] = useState(false);

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

  return (
    <span>
      <section
        onClick={togglePopUp}
        className={`flex flex-col bg-yellow-50 rounded-lg
          hover:cursor-pointer shadow-sm hover:bg-yellow-100
          h-[15rem] p-4 justify-between overflow-hidden ${className}`}
      >
        <section className="flex-grow overflow-hidden">
          <h2 id="note-card-title" className="font-bold mb-4">
            {title}
          </h2>
          <p id="note-card-text" className="text-gray-800 my-2 text-sm">
            {message}
            {file && (
              <span className="block mt-2 text-gray-500 text-xs">
                Attached File: {file}
              </span>
            )}
          </p>
        </section>

        <span className="w-full">
          <p className="text-xs text-gray-600 font-semibold pt-2">From {owner} - {date}</p>
        </span>
      </section>

      {showPopUp && <NoteEdit closeModal={togglePopUp} title={title} message={message} owner={owner} file={file} date={date} id={id} />}
    </span>
  );
}


export default Notes;
