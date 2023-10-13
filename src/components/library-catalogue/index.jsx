import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  useCheckoutBook,
  useReturnBook,
  useRetrieveAllBooksWithStatus,
  useRenewBook,
} from "./hooks";

import { Button, Container, Row, Col } from "react-bootstrap";

const LibraryCatalogue = () => {
  const {
    data: booksData,
    error,
    isLoading,
  } = useQuery("booksData", useRetrieveAllBooksWithStatus);

  const [books, setBooks] = useState(booksData);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setBooks(booksData);
  }, [booksData]);

  const { mutate: checkoutBook } = useCheckoutBook();
  const { mutate: returnBook } = useReturnBook();
  const { mutate: renewBook } = useRenewBook();

  const handleOnCheckout = (book) => {
    const { isbn } = book;
    const checkoutForUserId = userId[`input-userid-${isbn}`];

    checkoutBook({
      bookISBN: book.isbn,
      userId: checkoutForUserId,
    });
  };

  const handleOnReturn = (book) => {
    returnBook({
      bookISBN: book.isbn,
      userId: book.user.userId,
    });
  };

  const handleOnRenew = (book) => {
    renewBook({
      bookISBN: book.isbn,
      userId: book.user.userId,
    });
  };

  const handleSearchTextChange = (event) => {
    const searchText = event.target.value;
    setSearchText(searchText);

    if (searchText !== "") {
      const filteredBooks = booksData.filter((book) =>
        book.author.toLowerCase().includes(searchText.toLowerCase())
      );
      setBooks(filteredBooks);
    } else {
      setBooks(booksData);
    }
  };

  const [userId, setUserId] = useState([]);
  const handleUserIdChange = (event) => {
    const { name, value } = event.target;

    setUserId((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const getColorByStatus = (status) => {
    const isBookDue = status.find(
      (book) =>
        book.isReturned === false &&
        isDateInPast(new Date(book.bookReturnDueDate))
    );

    return isBookDue && "red";
  };

  const isDateInPast = (date) => {
    const currentDate = new Date();

    return date < currentDate;
  };

  return (
    <Container fluid style={{ padding: "2em" }}>
      <Row style={{ marginBottom: "2em", textAlign: "center" }}>
        <Col>
          <h4>Books Catalogue</h4>
          <hr />
          <Search
            handleSearchTextChange={handleSearchTextChange}
            searchText={searchText}
          />
          <hr />
        </Col>
      </Row>

      <Row>
        <Col>
          {books?.map((book) => (
            <Row key={book.id}>
              <Col xs={3}>
                <Row>
                  <Col>
                    <strong>Title: </strong>
                    {book.title}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <strong>Author: </strong>
                    {book.author}
                  </Col>
                </Row>
              </Col>
              <>
                {book.user ? (
                  <>
                    <Col xs={3}>
                      <Row>Checked out by {book.user.userName}</Row>
                      <Row>
                        <Col
                          style={{ color: getColorByStatus(book.bookStatus) }}
                        >
                          <strong>Due: </strong>
                          {
                            book.bookStatus?.find((b) => b.isReturned === false)
                              .bookReturnDueDate
                          }
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <strong>Times Renewed:</strong>{" "}
                          {
                            book.bookStatus.find((b) => b.isReturned === false)
                              .numberOfTimesRenewed
                          }
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={6} style={{ textAlign: "right" }}>
                      <Button
                        variant="warning"
                        style={buttonStyle}
                        onClick={() => handleOnReturn(book)}
                      >
                        Return book
                      </Button>

                      <Button
                        variant="info"
                        disabled={
                          book.bookStatus.find((b) => b.isReturned === false)
                            .numberOfTimesRenewed === 5
                        }
                        style={buttonStyle}
                        onClick={() => handleOnRenew(book)}
                      >
                        Renew book
                      </Button>
                    </Col>
                  </>
                ) : (
                  <Col xs={9} style={{ textAlign: "right" }}>
                    <label>User Id: </label>
                    <input
                      type="text"
                      name={`input-userid-${book.isbn}`}
                      onChange={handleUserIdChange}
                      value={userId[`input-userid-${book.isbn}`]}
                      style={style}
                    />
                    <Button
                      variant="success"
                      style={buttonStyle}
                      onClick={() => handleOnCheckout(book)}
                    >
                      Checkout this book
                    </Button>
                  </Col>
                )}
              </>
              <hr style={{ margin: "1em 0" }} />
            </Row>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default LibraryCatalogue;
// Should be in its own file
const Search = ({ handleSearchTextChange, searchText }) => {
  return (
    <Row>
      <Col>
        <label>Search By Auther name</label>
        <input
          type="text"
          onChange={handleSearchTextChange}
          value={searchText}
          style={style}
        />
      </Col>
    </Row>
  );
};

const buttonStyle = {
  borderRadius: 0,
  border: "none",
  marginLeft: "1em",
  width: "175px",
};

const style = {
  padding: "6px",
  width: "300px",
  marginLeft: "1em",
  border: "1px solid #A7C7E7",
};
