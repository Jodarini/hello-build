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
    auth.signIn(username);
  };

  return (
    <div className="w-full min-h-full flex flex-1 flex-col gap-6 justify-center items-center py-4">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 h-full justify-between min-w-full md:min-w-96"
      >
        <div className="flex flex-col justify-start">
          <label className="w-fit px-1 text-primary text-sm" htmlFor="username">
            Username
          </label>
          <input
            className="w-full appearance-none border-2 rounded-full py-2 px-3 font-normal text-primary text-sm "
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>
        <button
          className="min-w-fit rounded-full w-full font-bold bg-primary text-center active:bg-active lg:text-base text-base bg-[#172c45] text-white py-4"
          type="submit"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
