import { useEffect, useState } from "react";
import { getUserInfo } from "../app/actions.ts";

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<{
    username: string;
    mobile: string;
    id: string;
  } | null>(null);

  const info = async () => {
    return await getUserInfo();
  };
  useEffect(() => {
    info().then((data) => setUserInfo(data));
  }, []);

  return userInfo;
};
