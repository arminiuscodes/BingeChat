
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profilePic: {
        type: String,
        default: "",
    },
    username: {
        type: String,
        unique: true,
        sparse: true
    },
      // Add this field for blocked users
    blockedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: []
    }],
    // Optional: Add a field to track who blocked this user
    blockedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: []
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true });

// Generate username from email if not provided
userSchema.pre('save', function(next) {
    if (!this.username && this.email) {
        this.username = this.email.split('@')[0];
    }
    next();
});

const User = mongoose.model("User", userSchema);

export default User;
