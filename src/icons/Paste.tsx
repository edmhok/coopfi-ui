import { FC, SVGProps } from 'react'

export const Paste: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_15117_137246)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.00033 2.16699C8.27647 2.16699 8.50033 2.39085 8.50033 2.66699V9.45989L10.3134 7.64677C10.5087 7.45151 10.8253 7.45151 11.0205 7.64677C11.2158 7.84203 11.2158 8.15862 11.0205 8.35388L8.35388 11.0205C8.15862 11.2158 7.84203 11.2158 7.64677 11.0205L4.98011 8.35388C4.78484 8.15862 4.78484 7.84203 4.98011 7.64677C5.17537 7.45151 5.49195 7.45151 5.68721 7.64677L7.50033 9.45989V2.66699C7.50033 2.39085 7.72418 2.16699 8.00033 2.16699ZM2.16699 13.3337C2.16699 13.0575 2.39085 12.8337 2.66699 12.8337H13.3337C13.6098 12.8337 13.8337 13.0575 13.8337 13.3337C13.8337 13.6098 13.6098 13.8337 13.3337 13.8337H2.66699C2.39085 13.8337 2.16699 13.6098 2.16699 13.3337Z"
        fill="#1B1B1B"
      />
    </g>
    <defs>
      <clipPath id="clip0_15117_137246">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
)
