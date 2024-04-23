import { createIcon } from '@chakra-ui/react';

const AvatarIcon = createIcon({
  displayName: 'AvatarIcon',
  viewBox: '0 0 96 96',
  path: (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        opacity="0.3"
        x="4"
        y="4"
        width="88"
        height="88"
        rx="8"
        fill="url(#paint0_linear_14083_13189)"
      />
      <path
        d="M24 92C24 85.6348 26.5286 74.5303 31.0294 70.0294C35.5303 65.5286 41.6348 63 48 63C54.3652 63 60.4697 65.5286 64.9706 70.0294C69.4714 74.5303 72 85.6348 72 92C48 92 48 92 24 92ZM48 60C38.055 60 30 51.945 30 42C30 32.055 38.055 24 48 24C57.945 24 66 32.055 66 42C66 51.945 57.945 60 48 60ZM48 54C54.63 54 60 48.63 60 42C60 35.37 54.63 30 48 30C41.37 30 36 35.37 36 42C36 48.63 41.37 54 48 54Z"
        fill="url(#paint1_linear_14083_13189)"
      />
      <path
        d="M48 54C54.63 54 60 48.63 60 42C60 35.37 54.63 30 48 30C41.37 30 36 35.37 36 42C36 48.63 41.37 54 48 54Z"
        fill="url(#paint2_linear_14083_13189)"
      />
      <rect
        x="0.666667"
        y="0.666667"
        width="94.6667"
        height="94.6667"
        rx="10"
        stroke="#CFCCC9"
        stroke-width="1.33333"
      />
      <defs>
        <linearGradient
          id="paint0_linear_14083_13189"
          x1="4"
          y1="4"
          x2="96.0982"
          y2="87.4786"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FFC010" />
          <stop offset="0.48" stop-color="#EBA312" />
          <stop offset="0.71" stop-color="#D38015" />
          <stop offset="0.99" stop-color="#B24F18" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_14083_13189"
          x1="48"
          y1="24"
          x2="72.8748"
          y2="81.1785"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#F3AF11" />
          <stop offset="0.99" stop-color="#D17D15" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_14083_13189"
          x1="48"
          y1="24"
          x2="72.8748"
          y2="81.1785"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#F3AF11" />
          <stop offset="0.99" stop-color="#D17D15" />
        </linearGradient>
      </defs>
    </svg>
  ),
});

export { AvatarIcon };
