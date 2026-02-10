import { useState } from "react";
import { auth } from "../config/firebase";
import { IconText } from "./Icon";
import ModalOverlay from "./ModalOverlay";
import { IconTitleSection } from "./TitleSection";
import { UserProfile } from "./modal-group/Modal";


function MenuBar ({ closeModal }) {
  const user = auth.currentUser;

  const [visibilitity, setVisbility] = useState({
  });

  const toggleVisbility = (section) => {
    setVisbility((prev) => ({
      ...prev,
      [section]: !prev[section]
    }))
  };
  
  return (
    <ModalOverlay onClick={closeModal}>
      <div className="z-50 absolute h-full left-0 max-w-sm w-full bg-white flex flex-col p-4">
        <IconTitleSection iconOnClick={closeModal} dataFeather="x" title="Menu"/>
          {user ? (
            <UserProfile user={user} overlay={false} />
          ) :
            <IconText text="No Logged In User" />
          }
      </div>
    </ModalOverlay>
  )
}

export default MenuBar;