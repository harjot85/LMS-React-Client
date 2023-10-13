import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

export const useCheckoutBook = (book) => {
  const CHECKOUT_BOOK_QUERY_KEY = "checkoutBook";
  const queryClient = useQueryClient();
  return useMutation(
    (book) => axios.post("https://localhost:7111/api/v1/books/checkout", book),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries();
        console.log(data);
      },
      onError: (data) => {
        console.log("Error", data);
      },
    }
  );
};

export const useReturnBook = (book) => {
  const CHECKOUT_BOOK_QUERY_KEY = "returnBook";
  const queryClient = useQueryClient();
  return useMutation(
    (book) => axios.patch("https://localhost:7111/api/v1/books/return", book),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries();
        console.log(data);
      },
      onError: (data) => {
        console.log("Error", data);
      },
    }
  );
};

export const useRenewBook = (book) => {
  const CHECKOUT_BOOK_QUERY_KEY = "renewBook";
  const queryClient = useQueryClient();
  return useMutation(
    (book) => axios.patch("https://localhost:7111/api/v1/books/renew", book),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries();
        console.log(data);
      },
      onError: (data) => {
        console.log("Error", data);
      },
    }
  );
};

export const useRetrieveAllBooksWithStatus = async () => {
  const response = await axios.get(
    "https://localhost:7111/api/v1/books/status"
  );
  return response.data;
};
