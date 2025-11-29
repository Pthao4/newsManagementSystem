import { InputGroup, Form, Button } from "react-bootstrap";
import { BsSearch } from 'react-icons/bs';

export default function Search() {
  return (
    <InputGroup className="d-flex justify-content-center align-items-center w-100">
      <InputGroup.Text>Search</InputGroup.Text>
      <Form.Control
        placeholder="Enter to search"
        aria-label="Search"
      ></Form.Control>
      <Button variant="secondary"><BsSearch/></Button>
    </InputGroup>
  );
}
