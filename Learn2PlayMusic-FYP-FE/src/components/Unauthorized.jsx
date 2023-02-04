import { Link } from "react-router-dom";

export default function Unauthorized() {
    return (
      <div>
        <h2>You are not authorized to visit this page</h2>
        <p>
          <Link to="/">Go to the home page</Link>
        </p>
      </div>
    );
  }