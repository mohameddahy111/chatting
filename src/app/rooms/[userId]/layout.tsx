import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma.ts";
import FriendsList from "../../../components/friendsList.tsx";
import SearchBox from "../../../components/searchBox.tsx";
import { UserContextProvider } from "../../../contexts/userContext.tsx";
import { createusersDomy, logOutUser } from "../../actions.ts";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  // await createusersDomy();
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      rooms: {
        include: {
          users: true,
          messages: true,
        },
      },

      friends: true,
    },
  });
  if (!user) return notFound();

  return (
    <UserContextProvider user={user}>
      <main className=" w-full h-full flex  flex-col gap-1 ">
        <header>
          <nav className="w-full h-16 bg-gray-800 flex items-center px-4">
            <div className=" flex justify-between w-full items-center">
              <h1 className="text-green-400 text-lg font-semibold capitalize ">
                {" "}
                {`${user.username} Chat Room`}{" "}
              </h1>
              <div className="">
                <button onClick={logOutUser} className=" cursor-pointer bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors">
                  Log out
                </button>
              </div>
            </div>
          </nav>
        </header>
        <section className=" grid-cols-12  grid  gap-4 px-4">
          <aside className="  rounded-2xl bg-gray-500/40 shadow-2xl col-span-3 h-[calc(100vh-70px)] p-4">
            <div className="">
              <SearchBox />
            </div>
            <div className="mt-4">
              <h3 className="my-1 capitalize"> friends List </h3>
              <hr />
            </div>
            <div className="">
              <FriendsList />
            </div>
          </aside>
          <section className=" col-span-9  h-[calc(100vh-80px)] flex flex-col  ">
            {children}
          </section>
        </section>
      </main>
    </UserContextProvider>
  );
}
