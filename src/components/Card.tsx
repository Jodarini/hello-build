import { ReactNode } from "@tanstack/react-router";

export const Card = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  return (
    <div className={`rounded shadow-md bg-gray-50 p-4 ${className}`}>
      {children}
    </div>
  );
};
