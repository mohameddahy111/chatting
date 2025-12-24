"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { NoSsr, Typography } from "@mui/material";
import { UserContext } from "../contexts/userContext.tsx";
import { addFriend, leavingChat } from "../app/actions.ts";
import SendMessage from "./SendMessage.tsx";
import { useParams } from "next/navigation";

export default function ChatTabs() {
  const {
    roomsList: chatList,
    setRoomsList: setChatList,
    userList,
    setUserList,
    tabsvalue,
    setTabsValue,
  } = UserContext();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabsValue(newValue);
  };

  async function addFriends(friendId: string) {
    const update = await addFriend(friendId);
    setUserList(update.friends);
  }
  async function handrelLeavingChat(roomId: string) {
    const res = await leavingChat({ roomId });
    setChatList(res);
    if (res.length > 0) {
      setTabsValue(res[res.length - 1].id);
    }
  }
  const { userId } = useParams();

  return (
    <NoSsr>
      <Box
        bgcolor={"#2a2e34"}
        component={"div"}
        sx={{ width: "100%", typography: "body1", borderRadius: 2.5 }}
      >
        <TabContext value={tabsvalue}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "green",
                },
                " & .MuiTab-root.Mui-selected": {
                  color: "green",
                },
                " & .MuiTab-root": {
                  color: "white",
                },
              }}
              onChange={handleChange}
              aria-label="lab API tabs example"
            >
              {chatList.map((room: any) => (
                <Tab
                  label={<Typography>{room.name}</Typography>}
                  value={room.id}
                />
              ))}
            </TabList>
          </Box>
          {chatList.map((room: any) => (
            <TabPanel
              key={room.id}
              value={room.id}
              sx={{ p: 0, height: "calc(100vh - 120px)" }}
            >
              <div className=" h-full flex flex-col ">
                <div className="">
                  <div className=" gap-2 flex justify-end px-4 py-2 border-b border-gray-600 ">
                    {!userList.find((ele: any) =>
                      room.users.map((u: any) => u.id).includes(ele.id)
                    ) && (
                      <button
                        onClick={() =>
                          addFriends(
                            room.users.find((e: any) => e.id !== room.ownerId)
                              ?.id as string
                          )
                        }
                        className=" cursor-pointer mt-2 bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-700 transition-colors "
                      >
                        Add Friend
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handrelLeavingChat(room.id);
                      }}
                      className=" cursor-pointer mt-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors "
                    >
                      leaving Chat
                    </button>
                  </div>
                </div>
                <div className=" flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100svh - 200px)] ">
                  {room.messages.length === 0 ? (
                    <div className=" flex justify-center items-center h-full ">
                      <h4 className=" text-gray-400 text-lg ">
                        No messages yet , start the conversation
                      </h4>
                    </div>
                  ) : (
                    <div className="  flex flex-col gap-3 overflow-y-auto ">
                      {room.messages.map((msg: any) => (
                        <div
                          key={msg.id}
                          className={`p-2 flex w-full rounded-md max-w-xs ${
                            msg.senderId === userId
                              ? "bg-green-600 text-white self-start"
                              : "bg-gray-300 text-black self-end"
                          }`}
                        >
                          <p>{msg.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <SendMessage roomId={room.id} senderId={userId as string} />
              </div>
            </TabPanel>
          ))}
        </TabContext>
      </Box>
    </NoSsr>
  );
}
