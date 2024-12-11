import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { useAuth } from "../auth";

export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  const [username, setUsername] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = auth.signUp(username);
    if (success) {
      navigate({ to: "/login" });
    }
  };

  return (
    <div className="pt-4">
      Sign up page
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col justify-start">
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
          Sign Up
        </button>
      </form>
    </div>
  );
}
