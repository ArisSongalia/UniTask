import React from 'react';
import TitleSection from './TitleSection';

function SocialSection({ className = '' }) {
  return (
    <div
      className={`flex z-100 absolute top-20 shadow-md right-4 flex-col p-4 rounded-md w-[30rem] h-[30rem] overflow-hidden bg-white ${className}`}
    >
      <TitleSection title="Socials" buttonText="New Chat" />
      <section className="flex gap-2">

        <section
          id="user-chat-heads"
          className="min-w-fit h-full"
        >

        </section>

        <section
          id="main-message"
          className="bg-gray-50 rounded-lg w-full h-full overflow-y-auto"
        >

        </section>
      </section>
    </div>
  );
}

export default SocialSection;
