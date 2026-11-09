import { Link } from "react-router-dom";
import { ModeToggle } from "./ui/mode-toggle";
import Logo from "../features/auth/components/logo.tsx";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <>
      <header className="text-white p-4 border-b-2 border-border ">
        <div className="flex items-center justify-between">
          <Logo />
          <nav className="flex items-center space-x-4">
            <ModeToggle />
            <Link to="/create">
              <Button
                variant="default"
                className="bg-[#D9532C] hover:bg-[#C74B2A] px-4 py-4"
              >
                Create New Post
              </Button>
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
