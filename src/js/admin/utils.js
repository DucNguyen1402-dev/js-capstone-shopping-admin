export const getFriendlyErrorMessage = (error) => {
  if (!error.response) {
    return "Network Error! Please check your internet connection and try again.";
  }
  const code = error.response?.status;
  const messageMap = {
    400: "Data is invalid. Please check your input.",
    409: "This item already exists.",
    500: "Server is having a bad day. Try again later."
  };
  return messageMap[code] || "Something went wrong.";
};