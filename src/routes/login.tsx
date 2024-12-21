import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { useAuth } from "../auth";
import Spinner from "../components/Spinner";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const auth = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await auth.signIn(username);
    const data = await res.json();
    if (!res.ok) {
      setError(res.statusText);
    }

    window.location.href = data.url;
    setIsLoading(false);
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
          {error && <span>{error}</span>}
        </div>
        <button
          className={`min-w-fit rounded-full w-full font-bold bg-primary text-center active:bg-active lg:text-base text-base bg-[#172c45] text-white py-4 disabled:bg-gray-500/50`}
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? (
            <div className="flex w-full items-center justify-center gap-2">
              Signing in...
              <Spinner />
            </div>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
    </div>
  );
}
