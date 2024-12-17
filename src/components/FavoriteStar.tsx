export const FavoriteStar = ({ favorite }: { favorite: boolean }) => {
  if (!favorite)
    return (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          viewBox="0 0 24 24"
          data-icon="SvgStar"
          aria-hidden="true"
        >
          <path d="M12 3.44l2.781 5.636 6.219.9-4.5 4.387 1.062 6.194L12 17.635 6.438 20.56 7.5 14.366 3 9.979l6.219-.9z"></path>
        </svg>
      </div>
    );

  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        stroke="currentColor"
        fill="yellow"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        viewBox="0 0 24 24"
        data-icon="SvgStar"
        aria-hidden="true"
      >
        <path d="M12 3.44l2.781 5.636 6.219.9-4.5 4.387 1.062 6.194L12 17.635 6.438 20.56 7.5 14.366 3 9.979l6.219-.9z"></path>
      </svg>
    </div>
  );
};
