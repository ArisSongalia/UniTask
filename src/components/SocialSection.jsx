import React from 'react';
import { UserCard } from './Cards';
import TitleSection from './TitleSection';

function SocialSection({ className = '' }) {
  return (
    <div
      className={`flex flex-col p-4 rounded-md h-full w-full overflow-hidden bg-white shadow-sm ${className}`}
    >
      <TitleSection title="Socials" buttonText="New Chat" />
      <section className="flex w-full h-full gap-2">

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
