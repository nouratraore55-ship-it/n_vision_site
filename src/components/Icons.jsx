const common = {
  width: 28,
  height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function IconBox(props) {
  return (
    <svg {...common} {...props}>
      <path d="M3 8l9-4 9 4-9 4-9-4z" />
      <path d="M3 8v8l9 4 9-4V8" />
      <path d="M12 12v8" />
    </svg>
  );
}

export function IconTruck(props) {
  return (
    <svg {...common} {...props}>
      <rect x="1.5" y="7" width="12" height="9" rx="1" />
      <path d="M13.5 10h4l3 3v3h-7z" />
      <circle cx="6" cy="18.5" r="1.8" />
      <circle cx="17" cy="18.5" r="1.8" />
    </svg>
  );
}

export function IconCheckShield(props) {
  return (
    <svg {...common} {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12.5l2 2 4-4.5" />
    </svg>
  );
}

export function IconHeadset(props) {
  return (
    <svg {...common} {...props}>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="2.5" y="13" width="4" height="6" rx="1.5" />
      <rect x="17.5" y="13" width="4" height="6" rx="1.5" />
      <path d="M19.5 19v1a3 3 0 0 1-3 3h-3" />
    </svg>
  );
}

export function IconUpload(props) {
  return (
    <svg {...common} {...props}>
      <path d="M12 15V4" />
      <path d="M7.5 8.5L12 4l4.5 4.5" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

export function IconArrowRight(props) {
  return (
    <svg {...common} {...props}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconFacebook(props) {
  return (
    <svg {...common} {...props}>
      <path d="M14 8.5h2.5V5H14c-2.2 0-4 1.8-4 4v2.5H8V15h2v6h3v-6h2.4l.6-3.5H13V9c0-.3.2-.5.5-.5H14z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconInstagram(props) {
  return (
    <svg {...common} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconLinkedin(props) {
  return (
    <svg {...common} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10v7" />
      <circle cx="7.5" cy="7" r="0.6" fill="currentColor" stroke="none" />
      <path d="M11.5 17v-4a2.2 2.2 0 0 1 4.4 0v4" />
      <path d="M11.5 10v7" />
    </svg>
  );
}
