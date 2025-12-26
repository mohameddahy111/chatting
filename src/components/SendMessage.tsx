"use client";

import React from "react";
import { UserContext } from "../contexts/userContext.tsx";

export default function SendMessage({
  roomId,
  senderId,

}: {
  roomId: string;
  senderId: string;

}) {
  const [message, setMessage] = React.useState("");
  const { handleNewMessage } = UserContext();
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim() === "") return;
    handleNewMessage({
      roomId,
      senderId: senderId,
      message,
    });
    setMessage("");
  }

  return (
    <div className=" p-4 border-t border-gray-600 ">
      <form className=" flex gap-2 " onSubmit={handleSubmit}>
        <input
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          type="text"
          placeholder="Type your message..."
          className=" flex-1 px-4 py-2 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 "
        />
        <button
          onClick={handleSubmit}
          type="button"
          className=" bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors "
        >
          Send
        </button>
      </form>
    </div>
  );
}
