import { createFileRoute, Link } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { useAuth } from "../auth";

export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(undefined);
  const auth = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await auth.signUp(username);
    if (res.error) {
      setError(res.error);
    } else if (res.success) {
      window.location.href = "http://localhost:5173/login";
    }
  };

  return (
    <>
      <div className="w-full min-h-full flex flex-1 flex-col gap-6 justify-center items-center py-4">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 h-full justify-between min-w-full md:min-w-96"
        >
          <div className="flex flex-col justify-start relative">
            <label
              className="w-fit px-1 text-primary text-sm"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className={`w-full border-2 focus:border-none focus-visible:border-none target:border-none rounded-full py-2 px-3 font-normal text-primary text-sm ${
                error && "border-red-500"
              }`}
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
            <span className="absolute bottom-[-1.2rem] text-xs text-red-500">
              {error && <span>{error}</span>}
            </span>
          </div>
          <button
            className="min-w-fit rounded-full w-full font-bold bg-primary text-center active:bg-active lg:text-base text-base bg-[#172c45] text-white py-4"
            type="submit"
          >
            Sign up
          </button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#FFFFFF] text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>

          <Link
            to="/login"
            className="block px-2  sm:px-0 sm:py-0 sm:inline-block sm:mt-0 active:bg-active active:text-white sm:active:bg-transparent  border-b-2 border-transparent [&.active]:font-bold"
          >
            <button className="min-w-fit rounded-full w-full text-center active:bg-active lg:text-base text-base text-gray-700 py-4 border-2">
              Sign in
            </button>
          </Link>
        </form>
      </div>
    </>
  );
}
