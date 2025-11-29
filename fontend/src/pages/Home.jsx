// import { useState, useEffect } from "react";
// import { newsArticleAPI } from "../api/newsArticleAPI";
// import HDetailNewsArticles from "../components/specific/HDetailNewsArticles";
// import DetailNewsArticles from "../components/specific/DetailNewsArticles";
// import { Container, Row, Col } from "react-bootstrap";
// import CardVertical from "../components/common/CardVertical";
// import { InputGroup, Form, Button } from "react-bootstrap";
// import { BsSearch } from 'react-icons/bs';
// const Home = () => {
//   const [articles, setArticles] = useState([]);

//   useEffect(() => {
//     const fetchArticles = async () => {
//       const data = await newsArticleAPI.getNewsArticles();
//       console.log(data);
//       setArticles(data);
//     };
//     fetchArticles();
//   }, []);

//   return (
//     <Container className="my-4">
//       <InputGroup className="d-flex justify-content-center align-items-center w-100">
//       <InputGroup.Text>Search</InputGroup.Text>
//       <Form.Control
//         placeholder="Search by news title"
//         aria-label="Search"
//       ></Form.Control>
//       <Button variant="secondary"><BsSearch/></Button>
//     </InputGroup>
//       <Row className="align-items-stretch">
//         <Col md={8} className="mb-4 d-flex flex-column">
//           {articles.length > 0 && (
//             <>
//               <DetailNewsArticles newsArticles={articles[0]} />
//               <DetailNewsArticles newsArticles={articles[3]} />
//             </>
//           )}
//         </Col>
//         <Col md={4} className="mb-4 d-flex flex-column">
//           {articles.length > 1 && (
//             <CardVertical article={articles[1]} />
//           )}
//         </Col>
//       </Row>
//       <h3 className="mt-4 fw-bold">News</h3>
//       <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 mt-4">
//         {articles.map((item) => (
//           <Col className="col" key={item.id}>
//             <HDetailNewsArticles newsArticles={item} />
//           </Col>
//         ))}
//       </Row>
//     </Container>
//   );
// };

// export default Home;
import { useState, useEffect } from "react";
import { newsArticleAPI } from "../api/newsArticleAPI";
import HDetailNewsArticles from "../components/specific/HDetailNewsArticles";
import DetailNewsArticles from "../components/specific/DetailNewsArticles";
import CardVertical from "../components/common/CardVertical";
import { Container, Row, Col, InputGroup, Form, Button, Card } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const data = await newsArticleAPI.getNewsArticles();
      setArticles(data);
      setFilteredArticles(data);
    };
    fetchArticles();
  }, []);

  // Lọc dữ liệu tìm kiếm (debounce nhẹ)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) setFilteredArticles(articles);
      else {
        const filtered = articles.filter((a) =>
          a.title.toLowerCase().includes(query)
        );
        setFilteredArticles(filtered);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [searchQuery, articles]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <Container className="my-4">
      {/* Thanh search */}
      <InputGroup className="mb-4 w-75 mx-auto shadow-sm rounded-3 border border-light bg-white">
        <InputGroup.Text className="bg-light text-secondary border-0 fw-semibold">
          Search
        </InputGroup.Text>
        <Form.Control
          placeholder="Search by news title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-0 bg-white text-secondary"
        />
        <Button variant="outline-secondary">
          <BsSearch />
        </Button>
      </InputGroup>

      {/* Kết quả tìm kiếm (ẩn/hiện chứ không đổi layout) */}
      <div
        style={{
          display: isSearching ? "block" : "none",
          transition: "opacity 0.3s ease",
        }}
      >
        <h5 className="text-center mb-4 fw-bold text-secondary">
          Search Results ({filteredArticles.length})
        </h5>

        <div className="d-flex flex-column align-items-center">
          {filteredArticles.length > 0 ? (
            filteredArticles.slice(0, 5).map((article) => (
              <Card
                key={article.id}
                className="mb-3 w-75 shadow-sm border-start border-3 border-light bg-light-subtle"
              >
                <Card.Body className="py-3 px-4">
                  <Card.Title className="h6 text-dark fw-semibold mb-1">
                    {article.title.length > 80
                      ? article.title.substring(0, 80) + "..."
                      : article.title}
                  </Card.Title>
                  <Card.Text className="text-muted small mb-2">
                    {article.content?.length > 120
                      ? article.content.substring(0, 120) + "..."
                      : article.content}
                  </Card.Text>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="rounded-pill px-3"
                    onClick={() =>
                      (window.location.href = `/newsArticles/${article.id}`)
                    }
                  >
                    Read more
                  </Button>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted">
              No articles found for “{searchQuery}”
            </p>
          )}
        </div>
      </div>

      {/* Giao diện mặc định */}
      <div style={{ display: isSearching ? "none" : "block" }}>
        <Row className="align-items-stretch">
          <Col md={8} className="mb-4 d-flex flex-column">
            {articles.length > 0 ? (
              <>
                <DetailNewsArticles newsArticles={articles[0]} />
                {articles[3] && (
                  <DetailNewsArticles newsArticles={articles[3]} />
                )}
              </>
            ) : (
              <p className="text-center text-muted">No articles available.</p>
            )}
          </Col>
          <Col md={4} className="mb-4 d-flex flex-column">
            {articles[1] && <CardVertical article={articles[1]} />}
          </Col>
        </Row>

        <h4 className="mt-4 fw-bold text-secondary">Latest News</h4>
        <Row className="row-cols-2 row-cols-sm-3 row-cols-md-4 g-3 mt-2">
          {articles.map((item) => (
            <Col key={item.id}>
              <HDetailNewsArticles newsArticles={item} />
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default Home;
