import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const signIn = () => {
    const storedUsers = localStorage.getItem("users");
    const users: string[] = storedUsers ? JSON.parse(storedUsers) : [];

    if (users.some((user) => user === username)) {
      alert("users logged in");
      navigate({ to: "/" });
      return;
    }
    alert("users not logged in");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn();
  };

  return (
    <div>
      Sign in page
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}
