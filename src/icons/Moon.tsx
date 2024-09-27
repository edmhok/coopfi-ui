import { FC, SVGProps } from 'react'

export const Moon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.23975 2.57996C6.27336 2.47342 6.27165 2.35503 6.22672 2.24329C6.1237 1.98708 5.83249 1.8629 5.57628 1.96592C3.18773 2.92634 1.5 5.2649 1.5 7.99885C1.5 11.5887 4.41015 14.4989 8 14.4989C10.736 14.4989 13.0759 12.8087 14.035 10.4173C14.1378 10.161 14.0134 9.86992 13.7571 9.76712C13.6153 9.71025 13.4628 9.72294 13.3375 9.78904C12.7171 10.0319 12.0414 10.1655 11.3333 10.1655C8.29577 10.1655 5.83333 7.70303 5.83333 4.66546C5.83333 3.94341 5.97221 3.25501 6.22426 2.62465C6.23017 2.60985 6.23533 2.59494 6.23975 2.57996Z"
        fill="#1B1B1B"
      />
    </g>
    <defs>
      <clipPath id="clip0_19246_224791">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
)
