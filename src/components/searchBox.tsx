"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { UserContext } from "../contexts/userContext.tsx";
import { useSnackbar } from "notistack";
import { searchAboutMembers } from "../app/actions.ts";

export default function SearchBox() {
  const { enqueueSnackbar } = useSnackbar();
  const { setUserList , setClear} = UserContext();
  const [searshValue, setSearshValue] = useState("");
  async function handleSearch() {
    const list = await searchAboutMembers(searshValue);
    if (list.length > 0) {
      setUserList(list);
      setSearshValue("");
      setClear(true);
    } else {
      enqueueSnackbar("No members found", { variant: "warning" });
    }
  }
  return (
    <div className=" flex items-center relative ">
      <input
        value={searshValue}
        onChange={(e) => setSearshValue(e.target.value)}
        type="text"
        placeholder="Search members..."
        className=" w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 "
      />
      <button onClick={handleSearch} className=" active:bg-gray-300  absolute  right-2 top-2 hover:bg-gray-200/30 p-1 rounded-full transition-all ">
        <i>
          <Search className="right-3 cursor-pointer top-3 h-5 w-5 text-gray-400 " />
        </i>
      </button>
    </div>
  );
}
