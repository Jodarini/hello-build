import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";

export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const signUp = (newUsername: string) => {
    const storedUsers = localStorage.getItem("users");

    const users: string[] = storedUsers ? JSON.parse(storedUsers) : [];

    if (users.some((user) => user === newUsername)) {
      alert("User already exists");
      return;
    }

    users.push(newUsername.trim());

    localStorage.setItem("users", JSON.stringify(users));
    setUsername("");

    navigate({ to: "/login" });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUp(username);
  };

  return (
    <div>
      Sign up page
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {username}
    </div>
  );
}
