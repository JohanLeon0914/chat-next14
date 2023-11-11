"use client"
import { db } from '../../firebaseconfig'
import { ChangeEvent, useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";

interface User {
  id: string;
  email: string;
}

export default function SearchBarComponent() {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  const usersCollection = collection(db, "users");
  const chatsCollection = collection(db, "chats");

  const searchUsers = async (searchText: string) => {
    const q = query(
      usersCollection,
      where("email", ">=", searchText),
      where("email", "<=", searchText + "\uf8ff"),
      where("email", "!=", currentUserEmail)
    );
    const querySnapshot = await getDocs(q);
    const matchingUsers: User[] = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as User[];
    setUsers(matchingUsers);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setSearchText(text);
    searchUsers(text);
  };

  const handleAddChat = async (user: User) => {
    const chatRef = doc(chatsCollection, `${currentUserEmail}_${user.email}`);
    await setDoc(chatRef, {
      users: [currentUserEmail, user.email]
    });
    // Puedes añadir lógica adicional aquí, como redireccionar a la vista del chat, etc.
  };

  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem("user");
    if (userFromLocalStorage) {
      const user = JSON.parse(userFromLocalStorage);
      setCurrentUserEmail(user.email);
    }
  }, []);

  return (
    <div>
      <form className="bg-gray-200 p-4 rounded-lg shadow-md text-center">
        <h2 className="text-lg font-semibold mb-2">Search a User by Email</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={handleInputChange}
          className="w-full py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
        />
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {users.map((user) => (
          <div key={user.id} className="bg-gray-200 p-4 rounded-lg shadow-md text-center">
            <div className="text-blue-500 font-bold">{user.email}</div>
            <button
              className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
              onClick={() => handleAddChat(user)}
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}