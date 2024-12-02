import React from 'react';
import Button from './Button';
import UserCard from './UserCard';
import TitleSection from './TitleSection';

function SocialSection({ className = '' }) {
  return (
    <div
      className={`flex flex-col p-4 rounded-2xl h-full w-full overflow-hidden bg-white shadow-sm ${className}`}
    >
      <TitleSection title="Socials" buttonText="New Chat" />
      <section className="flex w-full h-full gap-2">
        {/* Chat Cards Section */}
        <section
          id="user-chat-heads"
          className="min-w-fit h-full"
        >
          <UserCard />
          <UserCard />
          <UserCard />
        </section>

        {/* Main Message Section */}
        <section
          id="main-message"
          className="bg-gray-50 rounded-lg w-full h-full overflow-y-auto"
        >
          {/* CHAT BOX */}
        </section>
      </section>
    </div>
  );
}

export default SocialSection;
