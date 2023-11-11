"use client"
import Link from "next/link";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from '../../firebaseconfig'

interface Chat {
  id: string;
  users: string[];
}

const ChatsComponent = () => {
  const chatsCollection = collection(db, "chats");
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem("user");
    if (userFromLocalStorage) {
      const user = JSON.parse(userFromLocalStorage);
      setCurrentUserEmail(user.email);
    }
  }, []);

  const getUserChats = async () => {
    try {
      const q = query(chatsCollection, where("users", "array-contains", currentUserEmail));
      const querySnapshot = await getDocs(q);

      const chatsData: Chat[] = [];
      querySnapshot.forEach((doc) => {
        chatsData.push({
          id: doc.id,
          users: doc.data().users,
        });
      });

      setChats(chatsData);
    } catch (error) {
      console.error("Error al obtener los chats:", error);
    }
  };

  useEffect(() => {
    if (currentUserEmail) {
      getUserChats();
    }
  }, [currentUserEmail]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {chats.map((chat) => {
        const otherUserEmails = chat.users.filter((userEmail) => userEmail !== currentUserEmail);
        return (
            <Link key={chat.id} href={`/dashboard/chat/${chat.id}`} className="block bg-gray-200 p-4 rounded-lg shadow-md text-center">
              <div className="text-blue-500 font-semibold mb-2">
                {otherUserEmails.join(", ")}
              </div>
              <div className="text-blue-500 font-bold"></div>
            </Link>
        );
      })}
    </div>
  );
};

export default ChatsComponent;
