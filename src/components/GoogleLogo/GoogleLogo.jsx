import React from "react";

export const GoogleLogo = ({ className }) => {
  return (
    <svg
      className={`google-logo ${className}`}
      fill="none"
      height="14"
      viewBox="0 0 14 14"
      width="14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="g" clipPath="url(#clip0_0_644)">
        <path
          className="path"
          d="M13.16 7.14584C13.16 6.69084 13.1192 6.25334 13.0433 5.83334H7V8.31542H10.4533C10.3046 9.1175 9.8525 9.79709 9.17292 10.2521V11.8621H11.2467C12.46 10.745 13.16 9.1 13.16 7.14584Z"
          fill="#4285F4"
        />

        <path
          className="path"
          d="M6.99979 13.4167C8.73229 13.4167 10.1848 12.8421 11.2465 11.8621L9.17271 10.2521C8.59812 10.6371 7.86312 10.8646 6.99979 10.8646C5.32854 10.8646 3.91396 9.73584 3.40937 8.21917H1.26562V9.88167C2.32146 11.9788 4.49146 13.4167 6.99979 13.4167Z"
          fill="#34A853"
        />

        <path
          className="path"
          d="M3.40975 8.21917C3.28141 7.83417 3.2085 7.42292 3.2085 7C3.2085 6.57708 3.28141 6.16583 3.40975 5.78083V4.11833H1.266C0.831413 4.98458 0.583496 5.96458 0.583496 7C0.583496 8.03542 0.831413 9.01542 1.266 9.88167L3.40975 8.21917Z"
          fill="#FBBC05"
        />

        <path
          className="path"
          d="M6.99979 3.13542C7.94187 3.13542 8.78771 3.45917 9.45271 4.095L11.2931 2.25459C10.1819 1.21917 8.72937 0.583336 6.99979 0.583336C4.49146 0.583336 2.32146 2.02125 1.26562 4.11834L3.40937 5.78084C3.91396 4.26417 5.32854 3.13542 6.99979 3.13542Z"
          fill="#EA4335"
        />
      </g>

      <defs className="defs">
        <clipPath className="clip-path" id="clip0_0_644">
          <rect className="rect" fill="white" height="14" width="14" />
        </clipPath>
      </defs>
    </svg>
  );
};
