import { createIcon } from '@chakra-ui/react';

const AvatarIcon = createIcon({
  displayName: 'AvatarIcon',
  viewBox: '0 0 56 56',
  path: (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        opacity="0.3"
        x="2.33203"
        y="2.33203"
        width="51.3333"
        height="51.3333"
        rx="6"
        fill="url(#paint0_linear_1_423)"
      />
      <rect
        x="0.388889"
        y="0.388889"
        width="55.2222"
        height="55.2222"
        rx="7.61111"
        stroke="#CFCCC9"
        stroke-width="0.777778"
      />
      <path
        d="M14 53.6667C14 49.9536 15.475 43.476 18.1005 40.8505C20.726 38.225 24.287 36.75 28 36.75C31.713 36.75 35.274 38.225 37.8995 40.8505C40.525 43.476 42 49.9536 42 53.6667C28 53.6667 28 53.6667 14 53.6667ZM28 35C22.1988 35 17.5 30.3013 17.5 24.5C17.5 18.6988 22.1988 14 28 14C33.8012 14 38.5 18.6988 38.5 24.5C38.5 30.3013 33.8012 35 28 35Z"
        fill="url(#paint1_linear_1_423)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1_423"
          x1="2.33203"
          y1="2.33203"
          x2="56.056"
          y2="51.0279"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FFC010" />
          <stop offset="0.48" stop-color="#EBA312" />
          <stop offset="0.71" stop-color="#D38015" />
          <stop offset="0.99" stop-color="#B24F18" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1_423"
          x1="31"
          y1="17"
          x2="45.5103"
          y2="50.3541"
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
