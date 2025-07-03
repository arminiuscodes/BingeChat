import React, { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import ProfilePage from "./ProfilePage"; // Import ProfilePage component
import { UseAuthStore } from '../store/UseAuthStore'; // Import if authUser is needed for own profile
import Navbar from "../components/Navbar"; // Import Navbar

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { authUser } = UseAuthStore(); // Fetch authUser for own profile view if needed

  // State to manage visibility of the ProfilePage
  const [showProfile, setShowProfile] = useState(false);
  // State to hold the user data for the ProfilePage
  const [profileUser, setProfileUser] = useState(null);

  // Function to handle opening a user's profile
  const handleProfileClick = (user) => {
    setProfileUser(user);
    setShowProfile(true);
  };

  // Function to handle closing the profile page
  const handleCloseProfile = () => {
    setShowProfile(false);
    setProfileUser(null);
  };

  return (
    <>
      {/* Pass handleProfileClick to Navbar */}
      <Navbar onProfileClick={handleProfileClick} />
      <div className="min-h-screen bg-base-200 pt-16 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        <div className="w-full max-w-[1600px] mx-auto h-[calc(100vh-4rem)] bg-base-100 shadow-xl rounded-2xl border border-base-300/30 overflow-hidden flex">

          {/* Desktop Layout: Sidebar and Chat/NoChatSelected side-by-side */}
          <div className="hidden lg:flex w-full h-full">
            {/* Pass handleProfileClick to Sidebar */}
            <Sidebar onProfileClick={handleProfileClick} />
            <div className="flex-1 flex flex-col">
              {!selectedUser ? (
                <NoChatSelected />
              ) : (
                // Pass handleProfileClick to ChatContainer
                <ChatContainer onProfileClick={handleProfileClick} />
              )}
            </div>
          </div>

          {/* Mobile Layout: Either Sidebar OR ChatContainer is shown, but not both */}
          <div className="flex lg:hidden w-full h-full">
            {!selectedUser ? (
              // On mobile, if no user is selected, show the Sidebar
              // Pass handleProfileClick to Sidebar
              <Sidebar onProfileClick={handleProfileClick} />
            ) : (
              // On mobile, if a user is selected, show the ChatContainer
              // Pass handleProfileClick to ChatContainer
              <ChatContainer onProfileClick={handleProfileClick} />
            )}
          </div>

        </div>

        {/* Conditionally render ProfilePage if showProfile is true and profileUser exists */}
        {showProfile && profileUser && (
          <ProfilePage user={profileUser} onClose={handleCloseProfile} />
        )}
      </div>
    </>
  );
};

export default HomePage;
