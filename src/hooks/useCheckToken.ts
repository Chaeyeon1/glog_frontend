const useCheckToken = ({ token }: { token?: string | null }) => {
  if (!token) {
    return;
  }
  return token;
};

export default useCheckToken;
