"use server";

import { prisma } from "../lib/prisma.ts";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

export async function createusersDomy() {
  await prisma.user.createMany({
    data: [
      { username: "Kawther", mobile: "01282925120" },
      { username: "M.atalla", mobile: "01225332295" },
      // { username: "charlie", mobile: "34567890123" },
      // { username: "david", mobile: "45678901233" },
      // { username: "eve", mobile: "56789012344" },
      // { username: "mohamed", mobile: "01092516161" },
    ],
  });
}

export async function createChatRoom(data: {
  username: string;
  mobile: string;
}) {
  const getUser = await prisma.user.findUnique({
    where: {
      mobile: data.mobile,
    },
  });
  if (!getUser) throw new Error("User not found", { cause: 404 });
  const token = jwt.sign(
    {
      username: getUser.username,
      mobile: getUser.mobile,
      id: getUser.id,
    },
    process.env.TOKEN_SECRET as string,
    {
      subject: getUser.id,
      expiresIn: "12h",
    }
  );
  (await cookies()).set({
    name: "auth_chat_token",
    value: token,
    httpOnly: true,
    maxAge: 12 * 60 * 60, // 12 hours
  });
  await prisma.user.update({
    where: {
      id: getUser.id,
    },
    data: {
      isOnline: true,
    },
  });
  return {
    userId: getUser.id,
    status: 200,
  };
}
export async function getUserInfo() {
  const cookiesStore = await cookies();
  const authToken = cookiesStore.get("auth_chat_token")?.value;
  if (authToken) {
    const decode = jwt.decode(authToken) as {
      username: string;
      mobile: string;
      id: string;
    };
    return decode;
  }
  redirect("/", RedirectType.replace);
}
export async function createRoom(guestId: string) {
  const ownerIdCookies = (await cookies()).get("auth_chat_token")?.value;
  if (!ownerIdCookies) {
    redirect("/", RedirectType.replace);
  }
  const ownerIdDecode = jwt.decode(ownerIdCookies) as {
    username: string;
    mobile: string;
    id: string;
  };
  const guest = await prisma.user.findUnique({
    where: {
      id: guestId,
    },
  });
  if (!guest) {
    throw new Error("Guest user not found", { cause: 404 });
  }
  const isExist = await prisma.room.findFirst({
    where: {
      ownerId: ownerIdDecode.id,
      users: { some: { id: guestId } },
    },
    include: {
      users: true,
      messages: true,
    },
  });
  if (isExist) {
    return {
      roomsList: null,
      isExist,
    };
  }
  
  await prisma.room.create({
    data: {
      ownerId: ownerIdDecode.id,
      users: {
        connect: [{ id: ownerIdDecode.id }, { id: guestId }],
      },
      name: `chat_${guest.username}_${Date.now()} `,
    },
  });
  const roomsList = await prisma.room.findMany({
    where: {
      ownerId: ownerIdDecode.id,
    },
    include: {
      users: true,
      messages: true,
    },
  });
  return {
    roomsList,
    isExist: null,
  };
}
export async function addFriend(friendId: string) {
  console.log(friendId);
  const ownerIdCookies = (await cookies()).get("auth_chat_token")?.value;
  if (!ownerIdCookies) {
    redirect("/", RedirectType.replace);
  }
  const ownerIdDecode = jwt.decode(ownerIdCookies) as {
    username: string;
    mobile: string;
    id: string;
  };
  const user = await prisma.user.update({
    where: {
      id: ownerIdDecode.id,
    },
    data: {
      friends: {
        connect: { id: friendId },
      },
    },
    include: {
      friends: true,
    },
  });
  return user;
}

export async function searchAboutMembers(val: string) {
  const members = await prisma.user.findMany({
    where: {
      mobile: val,
    },
  });
  return members;
}
export async function leavingChat({ roomId }: { roomId: string }) {
  const ownerIdCookies = (await cookies()).get("auth_chat_token")?.value;
  if (!ownerIdCookies) {
    redirect("/", RedirectType.replace);
  }
  await prisma.room.delete({
    where: {
      id: roomId,
    },
  });
  const ownerIdDecode = jwt.decode(ownerIdCookies) as {
    username: string;
    mobile: string;
    id: string;
  };

  const list = await prisma.room.findMany({
    where: {
      ownerId: ownerIdDecode.id,
    },
    include: {
      users: true,
      messages: true,
    },
  });
  return list;
}
export async function logOutUser() {
  const cookiesStore = await cookies();
  const authToken = cookiesStore.get("auth_chat_token")?.value;
  if (authToken) {
    const decode = jwt.decode(authToken) as {
      username: string;
      mobile: string;
      id: string;
    };
    await prisma.user.update({
      where: {
        id: decode.id,
      },
      data: {
        isOnline: false,
      },
    });
    cookiesStore.delete("auth_chat_token");
    redirect("/", RedirectType.replace);
  }
  redirect("/", RedirectType.replace);
}
export async function addMessage(data: {
  roomId: string;
  senderId: string;
  message: string;
}) {
  console.log(data)
  const newMessage = await prisma.message.create({
    data: {
      roomId: data.roomId,
      senderId: data.senderId,
      content: data.message,
    },
  });
  await prisma.room.update({
    where: {
      id: data.roomId,
    },
    data: {
      messages: {
        connect: { id: newMessage.id },
      },
    },
    include: {
      users: true,
      messages: true,
    },
  });
  return;
}
export async function getUpdatedRooms() {
  const ownerIdCookies = (await cookies()).get("auth_chat_token")?.value;
  if (!ownerIdCookies) {
    redirect("/", RedirectType.replace);
  }
  const ownerIdDecode = jwt.decode(ownerIdCookies) as {
    username: string;
    mobile: string;
    id: string;
  };
  const roomsList = await prisma.user.findUnique({
    where: {
      id: ownerIdDecode.id,
    },
    include: {
      rooms: {
        include: {
          users: true,
          messages: true,
        },
      },
    },
  });
  return roomsList;
}
