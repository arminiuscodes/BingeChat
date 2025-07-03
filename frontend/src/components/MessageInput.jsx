import React, { useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { UseAuthStore } from '../store/UseAuthStore'; // Import UseAuthStore to get authUser
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MessageInput = () => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  // Get sendMessage and addOptimisticMessage from useChatStore
  const { sendMessage, isSendingMessage, addOptimisticMessage, selectedUser } = useChatStore();
  const { authUser } = UseAuthStore.getState(); // Directly get authUser from UseAuthStore state

  // Function to resize and compress the image before sending
  const resizeAndCompressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;

        img.onload = () => {
          const MAX_WIDTH = 800; // Maximum width for the image (in pixels)
          const MAX_HEIGHT = 600; // Maximum height for the image (in pixels)
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 0.7 is 70% quality
          resolve(compressedDataUrl);
        };
        img.onerror = (error) => {
          console.error("Image load error:", error);
          reject(new Error("Failed to load image for compression."));
        };
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        reject(new Error("Failed to read file."));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    console.log("handleImageChange triggered.");
    console.log("Event target files:", e.target.files);
    const file = e.target.files[0];
    
    if (!file) {
      console.log("No file selected or file input was cancelled.");
      // Don't show error toast for cancelled selection
      // Clear the input value so selecting the same file again triggers change
      if (fileInputRef.current) fileInputRef.current.value = ''; 
      return; 
    }

    console.log("Selected file:", file);
    
    if (!file.type.startsWith('image/')) {
      console.log("File is not an image. Mime type:", file.type);
      toast.error('Please select an image file.');
      if (fileInputRef.current) fileInputRef.current.value = ''; 
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // Example: Allow up to 10MB original file size
      console.log("Image size too large. Size:", file.size / (1024 * 1024), "MB");
      toast.error('Original image size should be less than 10MB before compression.');
      if (fileInputRef.current) fileInputRef.current.value = ''; 
      return;
    }

    // Show a temporary toast while processing
    const processingToastId = toast.loading("Processing image...");

    try {
      console.log("Starting image compression...");
      const compressedImage = await resizeAndCompressImage(file);
      console.log("Image compressed successfully. Setting preview.");
      setImagePreview(compressedImage);
      toast.success("Image ready!", { id: processingToastId });
    } catch (error) {
      console.error("Error compressing image:", error);
      toast.error("Failed to process image for sending.", { id: processingToastId });
    } finally {
      // Ensure the file input is cleared after processing, regardless of success or failure
      // This allows the user to select the same file again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  // Mobile-friendly image upload trigger
  const triggerImageUpload = () => {
    if (fileInputRef.current && !isSendingMessage) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) {
      return; // Prevent sending empty messages
    }

    if (!authUser || !selectedUser) {
        toast.error("Please log in and select a user to chat with.");
        return;
    }

    // Generate a temporary client-side ID for optimistic update
    const tempMessageId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const messageDataToSend = {
      text: text.trim(),
      image: imagePreview,
      tempId: tempMessageId, // Pass tempId to backend for echo
    };

    // Apply optimistic UI ONLY if an image is present
    if (imagePreview) { // Check if imagePreview exists for optimistic update
      const optimisticMessage = {
        _id: tempMessageId, // Temporary ID
        senderId: authUser._id, // Use authUser._id for MongoDB compatibility
        receiverId: selectedUser._id,
        text: text.trim(),
        image: imagePreview,
        createdAt: new Date().toISOString(), // Client-side timestamp for immediate display
        status: 'sending', // Custom status for optimistic message
        isOptimistic: true, // Flag to identify optimistic messages
      };
      if (addOptimisticMessage) {
        addOptimisticMessage(optimisticMessage);
      }
    }

    // Clear input fields immediately
    setText('');
    removeImage();
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Send the message to the backend
    try {
      await sendMessage(messageDataToSend);
    } catch (error) {
      // Error handling for the actual send is done in useChatStore,
      // which will update the message status to 'failed'
      console.error("Failed to send message after optimistic update:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-base-100 border-t border-base-300/30 shadow-lg flex items-end gap-3 relative z-10">
      {/* Image Preview - Responsive positioning */}
      {imagePreview && (
        <div className="absolute bottom-[4.5rem] sm:bottom-[5rem] left-1/2 -translate-x-1/2 w-full max-w-[calc(100%-2rem)] sm:max-w-xs bg-base-200 p-2 rounded-xl shadow-xl border border-base-300 animate-in fade-in slide-in-from-bottom-4 duration-300 flex items-center justify-center">
          <img src={imagePreview} alt="Preview" className="max-h-20 rounded-lg object-contain w-full" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 btn btn-xs btn-circle btn-error shadow-md"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Hidden file input - Mobile compatible */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        className="absolute opacity-0 pointer-events-none -z-10"
        onChange={handleImageChange}
        disabled={isSendingMessage}
        style={{ position: 'absolute', left: '-9999px' }}
      />

      {/* Input area */}
      <div className="flex-1 relative">
        <div className="relative flex items-end bg-base-200 rounded-2xl border border-base-300/50 shadow-inner overflow-hidden">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder="Type a message..."
            className="textarea textarea-ghost w-full p-3 pr-12 bg-transparent text-base-content resize-none overflow-hidden max-h-40 min-h-[3rem] focus:outline-none scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-base-200/20"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isSendingMessage}
          ></textarea>

          {/* Image Upload Button */}
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            {/* Mobile-friendly image upload button */}
            {!imagePreview && (
              <button
                type="button"
                onClick={triggerImageUpload}
                className={`btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-primary touch-manipulation ${ 
                  isSendingMessage ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Attach image"
                disabled={isSendingMessage}
              >
                <Image size={20} />
              </button>
            )}
            {isSendingMessage && (
              <div className="loading loading-dots loading-sm text-primary"></div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Send Button */}
      <button
        type="submit"
        className={`btn btn-circle shadow-xl hover:shadow-2xl transform transition-all duration-300 border-2 touch-manipulation
          ${(!text.trim() && !imagePreview) || isSendingMessage
            ? 'btn-ghost border-base-300/30 text-base-content/40 cursor-not-allowed'
            : 'btn-primary border-primary/20 hover:scale-110 hover:-translate-y-1 active:scale-95'
          }`}
        disabled={isSendingMessage || (!text.trim() && !imagePreview)}
      >
        {isSendingMessage ? (
          <div className="loading loading-spinner loading-sm"></div>
        ) : (
          <Send size={20} className={`transform transition-transform duration-200 ${
            text.trim() || imagePreview ? 'translate-x-0.5' : ''
          }`} />
        )}
      </button>
    </form>
  );
};

export default MessageInput;