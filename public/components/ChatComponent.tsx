"use client"
import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  addDoc,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebaseconfig";

interface Message {
  sender: string;
  sendTime: string;
  text: string;
  timestamp: any;
}

interface ChatComponentProps {
  chatId: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const screenHeight = window.innerHeight;
  const maxChatHeight = screenHeight * 0.8;
  const messagesEndRef  = useRef<null | HTMLDivElement>(null); 

  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem("user");
    if (userFromLocalStorage) {
      const user = JSON.parse(userFromLocalStorage);
      setCurrentUserEmail(user.email);
    }

    // Consulta la colección de mensajes ordenados por timestamp
    const messagesQuery = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp")
    );

    // Registra un listener para los cambios en la colección de mensajes
    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const newMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        newMessages.push(doc.data() as Message);
      });
      setMessages(newMessages);
    });

    console.log(unsubscribe)

    return () => {
      // Limpia el listener al desmontar el componente
      unsubscribe();
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (newMessage) {
      const newMessageObj: Message = {
        sender: currentUserEmail,
        sendTime: new Date().toISOString(),
        text: newMessage,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, "chats", chatId, "messages"), newMessageObj);

      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-200 p-4">
        {/* Aquí puedes mostrar el nombre o el nombre del chat, etc. */}
        <p className="text-lg font-semibold"></p>
      </div>
      <div
        className="chat-messages flex-grow p-4"
        style={{ maxHeight: `${maxChatHeight}px`, overflowY: "auto" }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === currentUserEmail
                ? "justify-end"
                : "justify-start"
            } mb-2`}
          >
            <div
              className={`rounded-lg p-2 max-w-xs ${
                message.sender === currentUserEmail
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <div ref={messagesEndRef} className="text-sm font-semibold">
                {message.sender === currentUserEmail ? "Tú" : message.sender}
              </div>
              <div className="text-sm">{message.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input p-4">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-500 text-white rounded-lg px-4 py-2"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
