export const HoverDelete = ({className, h, w}: any) => (
  <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={w || "24"}
      height={h || "24"}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M7 21C6.45 21 5.979 20.804 5.587 20.412C5.195 20.02 4.99933 19.5493 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.804 20.021 18.412 20.413C18.02 20.805 17.5493 21.0007 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
        fill="#EB5757"
      />
    </svg>
  </div>
);
