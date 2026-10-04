import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <header className="text-white p-4 border-b-2 border-gray-600 ">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Blog Page</h1>
          <nav>
            <Link to="/create">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Create New Post
              </button>
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
