import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, // auth check
  });

  return { 
    isLoading: authUser.isLoading, 
    authUser: authUser.data?.user,
    isError: authUser.isError // Expose the error state
  };
};
export default useAuthUser;