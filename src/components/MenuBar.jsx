import { IconUser } from "./Icon";
import { auth } from "../config/firebase";
import { IconTitleSection}  from "./TitleSection";
import ModalOverlay from "./ModalOverlay";
import { UserProfile } from "./modal-group/Modal";
import { useState } from "react";
import Icon from "./Icon";


function MenuBar ({ closeModal }) {
  const user = auth.currentUser;

  const [visibilitity, setVisbility] = useState({
    accountProfile: false,
  });

  const toggleVisbility = (section) => {
    setVisbility((prev) => ({
      ...prev,
      [section]: !prev[section]
    }))
  };
  
  return (
    <ModalOverlay>
      <div className="z-50 absolute h-full right-0 max-w-sm w-full bg-white flex flex-col p-4">
        <IconTitleSection iconOnClick={closeModal} dataFeather="x" title="Menu"/>
          {user ? (
            <UserProfile user={user} closeModal={() => toggleVisbility('accountProfile')} overlay={false} />
          ) :
            null
          }

      </div>
    </ModalOverlay>
  )
}

export default MenuBar;