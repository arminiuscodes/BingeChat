// ✅ Fully Updated ChatHeader.jsx with Block/Unblock Logic
import { X, ArrowLeft, Trash2, MoreVertical, AlertTriangle, UserMinus, Ban } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { UseAuthStore } from "../store/UseAuthStore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ChatHeader = ({ onProfileClick }) => {
  const {
    selectedUser,
    setSelectedUser,
    clearChat,
    blockUser,
    unblockUser,
    removeFriend,
    getBlockedUsers,
    blockedUsers = []
  } = useChatStore();

  const { onlineUsers } = UseAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const isOnline = onlineUsers.includes(selectedUser._id);
  const isBlocked = blockedUsers?.some(id => id === selectedUser._id);

  useEffect(() => {
    if (selectedUser) {
      getBlockedUsers();
    }
  }, [selectedUser, getBlockedUsers]);

  const handleBlockUserClick = () => {
    setShowDropdown(false);
    setModalType("block");
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser) return;
    setIsProcessing(true);
    let loadingToastId;

    try {
      switch (modalType) {
        case "block":
          loadingToastId = toast.loading("Blocking user...");
          const success = await blockUser(selectedUser._id);
          if (success) {
            toast.success(`${selectedUser.fullName} has been blocked`, { id: loadingToastId });
          } else {
            toast.error("Failed to block user", { id: loadingToastId });
          }
          break;
        case "remove":
          loadingToastId = toast.loading("Removing friend...");
          await removeFriend(selectedUser._id);
          toast.success("Friend removed", { id: loadingToastId });
          setSelectedUser(null);
          break;
        case "clear":
          loadingToastId = toast.loading("Clearing chat...");
          await clearChat(selectedUser._id);
          toast.success("Chat cleared", { id: loadingToastId });
          break;
        default:
          break;
      }
      setShowConfirmModal(false);
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 border-b border-base-300/30 bg-base-100 shadow-sm sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => setSelectedUser(null)}
            className="btn btn-ghost btn-circle btn-sm lg:hidden"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="relative shrink-0 cursor-pointer" onClick={() => onProfileClick?.(selectedUser)}>
            <div className="avatar">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md ${isOnline ? "ring-4 ring-success/30" : "ring-2 ring-base-300/50"} ring-offset-2 ring-offset-base-100`}>
                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt={selectedUser.fullName}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-base-100 ${isOnline ? "bg-success" : "bg-base-400"}`}></div>
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-lg text-base-content truncate">{selectedUser.fullName}</h3>
            <p className={`text-sm font-medium ${isOnline ? "text-success" : "text-base-content/60"}`}>{isOnline ? "Online" : "Offline"}</p>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setShowDropdown(!showDropdown)} className="btn btn-ghost btn-circle btn-sm">
            <MoreVertical size={18} />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-base-100 rounded-lg shadow-lg border border-base-300 z-20">
              <div className="p-1">
                <button onClick={() => { setModalType("clear"); setShowConfirmModal(true); setShowDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-error/10 hover:text-error rounded-md">
                  <Trash2 size={16} /> Clear Chat
                </button>
                <button onClick={() => { setModalType("remove"); setShowConfirmModal(true); setShowDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-warning/10 hover:text-warning rounded-md">
                  <UserMinus size={16} /> Remove Friend
                </button>
                <div className="divider my-1"></div>
                {isBlocked ? (
                  <button
                    onClick={async () => {
                      try {
                        await unblockUser(selectedUser._id);
                        toast.success("User unblocked");
                        getBlockedUsers();
                        setShowDropdown(false);
                      } catch {
                        toast.error("Failed to unblock");
                      }
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-warning/10 hover:text-warning rounded-md"
                  >
                    <Ban size={16} /> Unblock User
                  </button>
                ) : (
                  <button
                    onClick={handleBlockUserClick}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-error/10 hover:text-error rounded-md"
                  >
                    <Ban size={16} /> Block User
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-xl w-96 shadow-xl">
            <h2 className="font-bold text-lg mb-2 capitalize">Confirm {modalType}</h2>
            <p className="text-base-content/70 mb-4">
              Are you sure you want to {modalType} {selectedUser.fullName}?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowConfirmModal(false)} className="btn btn-sm">Cancel</button>
              <button onClick={handleConfirmAction} className={`btn btn-sm ${modalType === "clear" ? "btn-error" : "btn-warning"}`} disabled={isProcessing}>
                {isProcessing ? <span className="loading loading-spinner loading-sm"></span> : `Confirm ${modalType}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;