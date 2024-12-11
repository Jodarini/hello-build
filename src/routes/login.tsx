import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { useAuth } from "../auth";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [username, setUsername] = useState("");
  const auth = useAuth();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isSignedIn = auth.signIn(username);
    if (isSignedIn) {
      auth.username = username;
    }
  };

  return (
    <div className="pt-4">
      Sign in page
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="w-fit px-1 text-primary text-sm" htmlFor="username">
            Username
          </label>
          <input
            className="w-full appearance-none border-2 rounded py-2 px-3 font-normal text-primary text-sm "
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Your username here"
          />
        </div>
        <button
          className="min-w-fit max-w-36  font-bold bg-primary text-center active:bg-active lg:text-base w-full text-base bg-[#172c45] text-white py-4"
          type="submit"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
