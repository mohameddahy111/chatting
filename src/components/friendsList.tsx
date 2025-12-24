"use client";

import { UserContext } from "../contexts/userContext.tsx";
import { createRoom } from "../app/actions.ts";

export default function FriendsList() {
  const {
    userList,
    clear,
    handleClear,
    setRoomsList,
    setTabsValue,
  } = UserContext();
  async function openRoom(guestId: string) {
    const res = await createRoom(guestId);
    if (res?.roomsList) {
      setRoomsList(res?.roomsList);
      setTabsValue(res.roomsList[res.roomsList.length - 1].id);
    } else {
      setTabsValue(res.isExist.id);
    }
  }
  return (
    <div>
      {userList.length === 0 ? (
        <div className="flesx flex-col justify-center items-center text-center mt-4 ">
          <h6 className=" text-red-400 mt-2 "> No friends found </h6>
          <p> search about your friends and added theme </p>
        </div>
      ) : (
        <ul className="my-2 flex flex-col gap-3 max-h-[calc(100vh-200px)] overflow-y-auto ">
          {userList.map((friend: any) => (
            <li
              onClick={() => openRoom(friend.id)}
              key={friend.id}
              className=" p-2 bg-gray-300/30 rounded-md transition-colors cursor-pointer "
            >
              <h4 className=" font-semibold capitalize ">
                {" "}
                {friend.username}{" "}
              </h4>
              <p className=" text-sm text-black "> {friend.mobile} </p>
            </li>
          ))}
          {clear && (
            <button
              onClick={handleClear}
              className=" mt-2 w-full bg-blue-500 text-white py-1 rounded-md hover:bg-blue-600 transition-colors "
            >
              Clear Search
            </button>
          )}
        </ul>
      )}
    </div>
  );
}
