"use client";

import ChatTabs from "../../../components/chatTabs.tsx";
import { UserContext } from "../../../contexts/userContext.tsx";

export default function Page() {
  const { roomsList: list } = UserContext();

  return <div className="">
    {list.length === 0 ? (
      <div className=" flex justify-center items-center h-full ">
        <h4 className=" text-gray-400 text-lg "> No rooms found , please create a room </h4>
      </div>
    ) : (
        <ChatTabs />
    )}
  </div>;
}
