import type { SVGProps } from "react";

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 48"
      width="40"
      height="48"
      role="img"
      aria-label="Blog logo"
      {...props}
    >
      <title>Blog logo</title>
      <rect y="4" width="40" height="40" rx="9.375" fill="#D9532C" />
      <rect
        x="15"
        y="10.875"
        width="10"
        height="2.5"
        rx="0.9375"
        fill="#FFF6EA"
      />
      <path
        d="M15.625 15.5625H24.375L28.4375 25.25L20 37.75L11.5625 25.25Z"
        fill="#FFF6EA"
      />
      <path d="M20 27.75V37.75" stroke="#D9532C" strokeWidth="1.25" />
      <circle cx="20" cy="25.25" r="2.34375" fill="#D9532C" />
    </svg>
  );
}
