import mongoose from "mongoose";
import { connectDB } from "./src/lib/db.js";
import User from "./src/models/User.js";
import FriendRequest from "./src/models/FriendRequest.js";
import { upsertStreamUser } from "./src/lib/stream.js";
import dotenv from "dotenv";

dotenv.config();

const myId = "689ae005b39b05c86e6bb592";

const dummyUsers = [
  {
    fullName: "Elena Petrova",
    email: "elena@example.com",
    password: "password123",
    bio: "Passionate about learning English and Japanese. I enjoy hiking and cooking.",
    profilePic: "https://avatar.iran.liara.run/public/1.png",
    nativeLanguage: "russian",
    learningLanguage: "english",
    location: "Moscow, Russia",
    isOnboarded: true,
  },
  {
    fullName: "Javier Fernandez",
    email: "javier@example.com",
    password: "password123",
    bio: "Hola! I'm a software engineer who wants to improve my Mandarin skills.",
    profilePic: "https://avatar.iran.liara.run/public/2.png",
    nativeLanguage: "spanish",
    learningLanguage: "mandarin",
    location: "Madrid, Spain",
    isOnboarded: true,
  },
  {
    fullName: "Anya Sharma",
    email: "anya@example.com",
    password: "password123",
    bio: "Learning French for an upcoming trip to Paris. Let's chat!",
    profilePic: "https://avatar.iran.liara.run/public/4.png",
    nativeLanguage: "hindi",
    learningLanguage: "french",
    location: "New Delhi, India",
    isOnboarded: true,
  },
  {
    fullName: "Kenji Tanaka",
    email: "kenji@example.com",
    password: "password123",
    bio: "I'm a photographer looking for a partner to practice my Korean with. My English is fluent.",
    profilePic: "https://avatar.iran.liara.run/public/5.png",
    nativeLanguage: "japanese",
    learningLanguage: "korean",
    location: "Tokyo, Japan",
    isOnboarded: true,
  },
  {
    fullName: "Fatima Al-Fassi",
    email: "fatima@example.com",
    password: "password123",
    bio: "Seeking to improve my English for my studies. I'm a native Arabic speaker.",
    profilePic: "https://avatar.iran.liara.run/public/6.png",
    nativeLanguage: "arabic",
    learningLanguage: "english",
    location: "Riyadh, Saudi Arabia",
    isOnboarded: true,
  },
  {
    fullName: "Luca Rossi",
    email: "luca@example.com",
    password: "password123",
    bio: "Ciao! I love all things Italian and want to learn more about the language.",
    profilePic: "https://avatar.iran.liara.run/public/7.png",
    nativeLanguage: "italian",
    learningLanguage: "german",
    location: "Rome, Italy",
    isOnboarded: true,
  },
  {
    fullName: "Sophie Dubois",
    email: "sophie@example.com",
    password: "password123",
    bio: "A fan of classic literature and French culture. I'm learning Spanish.",
    profilePic: "https://avatar.iran.liara.run/public/8.png",
    nativeLanguage: "french",
    learningLanguage: "spanish",
    location: "Paris, France",
    isOnboarded: true,
  },
  {
    fullName: "Alex Vink",
    email: "alex@example.com",
    password: "password123",
    bio: "I'm a Dutch student hoping to practice my German.",
    profilePic: "https://avatar.iran.liara.run/public/9.png",
    nativeLanguage: "dutch",
    learningLanguage: "german",
    location: "Amsterdam, Netherlands",
    isOnboarded: true,
  },
  {
    fullName: "Maria Silva",
    email: "maria@example.com",
    password: "password123",
    bio: "I love exploring different cultures and want to improve my English.",
    profilePic: "https://avatar.iran.liara.run/public/10.png",
    nativeLanguage: "portuguese",
    learningLanguage: "english",
    location: "Lisbon, Portugal",
    isOnboarded: true,
  },
  {
    fullName: "Chen Wei",
    email: "chen@example.com",
    password: "password123",
    bio: "A Chinese artist learning French. Let's connect!",
    profilePic: "https://avatar.iran.liara.run/public/11.png",
    nativeLanguage: "mandarin",
    learningLanguage: "french",
    location: "Shanghai, China",
    isOnboarded: true,
  },
];

const seedDB = async () => {
  console.log("Script starting..."); // Added this line

  try {
    await connectDB();

    console.log("Clearing old data...");
    await User.deleteMany();
    await FriendRequest.deleteMany();

    const newUsers = await User.insertMany(dummyUsers);
    console.log(`Inserted ${newUsers.length} dummy users.`);

    // Update your own account in the database
    const myUser = await User.findById(myId);
    if (myUser) {
        // Create friends for your account with some of the newly created users
        const friendsToAdd = [newUsers[0]._id, newUsers[1]._id, newUsers[2]._id];
        myUser.friends = friendsToAdd;
        await myUser.save();
        console.log(`Updated your account with new friends.`);

        // Also add your account to the friends list of the new users
        await Promise.all(
          friendsToAdd.map(async (friendId) => {
            await User.findByIdAndUpdate(friendId, { $addToSet: { friends: myId } });
          })
        );
        console.log(`Added you as a friend to the dummy accounts.`);

    } else {
        console.log("Your account not found, cannot create friends.");
    }

    // Call Stream API for each new user
    await Promise.all(
      newUsers.map(async (user) => {
        await upsertStreamUser({
          id: user._id.toString(),
          name: user.fullName,
          image: user.profilePic || "",
        });
      })
    );
    console.log(`Stream users created for dummy accounts.`);

    console.log("Database seeding complete! Disconnecting from MongoDB.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exit(1);
  }
};

seedDB();