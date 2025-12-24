"use client";

import * as React from "react";
import { createContext, ReactNode, useContext, useState } from "react";
import supabaseClient from "../lib/supabase.ts";
import { addMessage, getUpdatedRooms } from "../app/actions.ts";

export interface Rooms {
  messages: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    content: string;
    senderId: string;

    roomId: string;
    status: string;
  }[];
  users: {
    id: string;
    mobile: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    isOnline: boolean;
  }[];
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}
[];

const Base = createContext<any>(null);

export const UserContextProvider = ({
  children,
  user,
}: {
  children: ReactNode;
  user: any;
}) => {
  const [userList, setUserList] = useState(user.friends || []);
  const [roomsList, setRoomsList] = useState<Rooms[]>(user.rooms || []);
  const [tabsvalue, setTabsValue] = React.useState(
    roomsList[roomsList.length - 1]?.id || "1"
  );

  const [clear, setClear] = useState(false);
  function handleClear() {
    setUserList(user.friends || []);
    setClear(false);
  }
  function handleNewMessage(message: {
    roomId: string;
    senderId: string;

    message: string;
  }) {
    supabaseClient
      .channel("CHANNEL")
      .send({
        type: "broadcast",
        event: "new_message",
        payload: { ...message },
      })
      .then(async () => {
        await addMessage(message);
      })
      .catch((error) => {
        console.error("Error broadcasting message:", error);
      });
  }
  // const channel = supabaseClient.channel("Messages");
  React.useEffect(() => {
    const roomOne = supabaseClient.channel("CHANNEL", {
      config: {
        presence: {
          key: user.id,
        },
        broadcast: {
          self: true,
        },
      },
    });
    roomOne.on("broadcast", { event: "new_message" }, async (payload: any) => {
      const updatedUser = await getUpdatedRooms();
      setRoomsList(updatedUser?.rooms || []);
    });
    roomOne.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await roomOne.track({
          userId: user.id,
        });
      }
    });
    // To track user
    roomOne.on("presence", { event: "sync" }, () => {
      const state = roomOne.presenceState();
      console.log("Current presence state:", state);
    });
    return () => {
      roomOne.unsubscribe();
    };
  }, [user]);
  return (
    <Base.Provider
      value={{
        userList,
        setUserList,
        clear,
        setClear,
        handleClear,
        roomsList,
        setRoomsList,
        tabsvalue,
        setTabsValue,
        handleNewMessage,
      }}
    >
      {children}
    </Base.Provider>
  );
};
export const UserContext = () => {
  return useContext(Base);
};
