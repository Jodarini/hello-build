import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link
          to="/"
          className=" block py-4 px-2  sm:px-0 sm:py-0 sm:inline-block sm:mt-0 active:bg-active active:text-white sm:active:bg-transparent  border-b-2 border-transparent [&.active]:font-bold"
        >
          Home
        </Link>
        <Link
          to="/sign-up"
          className=" block py-4 px-2  sm:px-0 sm:py-0 sm:inline-block sm:mt-0 active:bg-active active:text-white sm:active:bg-transparent  border-b-2 border-transparent [&.active]:font-bold"
        >
          Sign up
        </Link>
        <Link
          to="/login"
          className=" block py-4 px-2  sm:px-0 sm:py-0 sm:inline-block sm:mt-0 active:bg-active active:text-white sm:active:bg-transparent  border-b-2 border-transparent [&.active]:font-bold"
        >
          Sign in
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
