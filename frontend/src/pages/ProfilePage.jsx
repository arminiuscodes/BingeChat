
import React, { useState, useEffect } from 'react';
import { UseAuthStore } from '../store/UseAuthStore.js';
import { Camera, User, Mail, Calendar, CheckCircle, X, Edit3, Save } from 'lucide-react';

const ProfilePage = ({ user, onClose }) => {
  const { authUser, isUpdatingProfile, updateProfile } = UseAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const isOwnProfile = authUser?._id === user?._id;

  useEffect(() => {
    setFullName(user?.fullName || '');
  }, [user]);

  const toast = {
    error: (message) => console.error(message),
    success: (message) => console.log(message)
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const profilePicSrc = selectedImage || user?.profilePic || '/avatar.png';

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-base-100 rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 btn btn-circle btn-sm bg-base-100 border-base-300 hover:bg-base-200 shadow-lg z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="bg-primary text-primary-content p-6 rounded-t-2xl text-center">
          <h2 className="text-xl font-semibold">
            {isOwnProfile ? "Your Profile" : `${user.fullName}'s Profile`}
          </h2>
          <p className="text-primary-content/80 mt-1">
            {isOwnProfile ? "Manage your profile settings" : "Profile information"}
          </p>
        </div>

        {/* Profile Image Section */}
        <div className="px-6 py-6 text-center bg-base-100">
          <div className="relative inline-block">
            <div className="avatar" onClick={() => setShowImageModal(true)}>
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 cursor-pointer hover:ring-secondary transition-all">
                <img
                  src={profilePicSrc}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Camera Upload - Only for own profile */}
            {isOwnProfile && (
              <label className="absolute -bottom-1 -right-1 btn btn-circle btn-sm btn-secondary hover:btn-secondary-focus shadow-lg cursor-pointer">
                {isUpdatingProfile ? (
                  <span className="loading loading-spinner w-3 h-3"></span>
                ) : (
                  <Camera className="w-3 h-3" />
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            )}
          </div>
          
          {isUpdatingProfile && (
            <div className="mt-3 flex items-center justify-center gap-2 text-secondary">
              <span className="loading loading-dots loading-sm"></span>
              <span className="text-sm">Updating...</span>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="px-6 pb-6 space-y-4 bg-base-100">
          {/* Full Name */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-base-content mb-3">
                <User className="w-4 h-4 text-primary" />
                <span>Full Name</span>
              </div>
              
              {isEditingName && isOwnProfile ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input input-bordered input-primary w-full"
                    disabled={isUpdatingProfile}
                    placeholder="Enter your full name"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        if (!fullName.trim()) return toast.error('Name cannot be empty!');
                        await updateProfile({ fullName });
                        setIsEditingName(false);
                      }}
                      disabled={isUpdatingProfile}
                      className="btn btn-primary btn-sm flex-1"
                    >
                      {isUpdatingProfile ? (
                        <>
                          <span className="loading loading-spinner w-3 h-3"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-3 h-3" />
                          Save
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setFullName(authUser?.fullName || '');
                      }}
                      className="btn btn-outline btn-sm flex-1"
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className={`p-3 bg-base-100 rounded-lg border border-base-300 ${isOwnProfile ? 'cursor-pointer hover:bg-base-200 transition-colors' : ''}`}
                  onClick={() => isOwnProfile && setIsEditingName(true)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-base-content">{user.fullName}</span>
                    {isOwnProfile && (
                      <Edit3 className="w-4 h-4 text-base-content/60" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-base-content mb-3">
                <Mail className="w-4 h-4 text-secondary" />
                <span>Email</span>
              </div>
              <div className="p-3 bg-base-100 rounded-lg border border-base-300">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-base-content">{user.email}</span>
                  <div className="badge badge-success badge-sm">Verified</div>
                </div>
              </div>
            </div>
          </div>

          {/* Member Since */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-base-content mb-3">
                <Calendar className="w-4 h-4 text-accent" />
                <span>Member Since</span>
              </div>
              <div className="p-3 bg-base-100 rounded-lg border border-base-300">
                <span className="font-medium text-base-content">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Picture Modal */}
        {showImageModal && (
          <div className="absolute inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 rounded-2xl">
            <div className="relative bg-base-100 rounded-xl shadow-xl max-w-xs w-full">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute -top-2 -right-2 btn btn-circle btn-xs bg-base-100 hover:bg-base-200 border-base-300 z-10"
              >
                <X className="w-3 h-3" />
              </button>
              
              <div className="p-4">
                <div className="aspect-square w-full rounded-lg overflow-hidden">
                  <img
                    src={profilePicSrc}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="text-center mt-3">
                  <p className="text-sm font-medium text-base-content">{user.fullName}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
