export default function TornyAvatar() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Neck */}
      <rect x="88" y="138" width="24" height="18" fill="#F5C5A3" />
      {/* Suit */}
      <path d="M15 200 Q18 162 42 154 Q70 144 100 142 Q130 144 158 154 Q182 162 185 200Z" fill="#0e1f44" />
      {/* Shirt lapels */}
      <path d="M88 156 L100 143 L112 156 L106 172 L100 167 L94 172Z" fill="white" />
      {/* Tie */}
      <polygon points="100,149 96,156 100,168 104,156" fill="#fcd116" />
      {/* Ears */}
      <ellipse cx="48" cy="90" rx="9" ry="11" fill="#F5C5A3" />
      <ellipse cx="152" cy="90" rx="9" ry="11" fill="#F5C5A3" />
      <ellipse cx="48" cy="90" rx="5" ry="7" fill="#e8a882" />
      <ellipse cx="152" cy="90" rx="5" ry="7" fill="#e8a882" />
      {/* Head */}
      <ellipse cx="100" cy="88" rx="52" ry="55" fill="#F5C5A3" />
      {/* Hair */}
      <path d="M50 78 Q52 28 100 24 Q148 28 150 78 Q145 44 100 40 Q55 44 50 78Z" fill="#1a1a1a" />
      <ellipse cx="100" cy="26" rx="40" ry="13" fill="#1a1a1a" />
      {/* Glasses - left */}
      <rect x="56" y="72" width="36" height="27" rx="8" fill="#e8f4fd" stroke="#1a1a1a" strokeWidth="4.5" />
      {/* Glasses - right */}
      <rect x="108" y="72" width="36" height="27" rx="8" fill="#e8f4fd" stroke="#1a1a1a" strokeWidth="4.5" />
      {/* Bridge */}
      <line x1="92" y1="86" x2="108" y2="86" stroke="#1a1a1a" strokeWidth="3.5" />
      {/* Side arms */}
      <line x1="46" y1="84" x2="56" y2="84" stroke="#1a1a1a" strokeWidth="3.5" />
      <line x1="144" y1="84" x2="154" y2="84" stroke="#1a1a1a" strokeWidth="3.5" />
      {/* Pupils */}
      <circle cx="74" cy="86" r="7.5" fill="#1a1a1a" />
      <circle cx="126" cy="86" r="7.5" fill="#1a1a1a" />
      {/* Shine */}
      <circle cx="77" cy="82" r="3" fill="white" />
      <circle cx="129" cy="82" r="3" fill="white" />
      {/* Nose */}
      <path d="M96 108 Q100 114 104 108" fill="none" stroke="#c4845a" strokeWidth="2.5" strokeLinecap="round" />
      {/* Mouth */}
      <path d="M76 120 Q100 136 124 120" fill="none" stroke="#c06060" strokeWidth="3.5" strokeLinecap="round" />
      {/* Teeth */}
      <path d="M83 121 Q100 130 117 121 Q117 130 100 130 Q83 130 83 121Z" fill="white" />
      {/* Cheek blush */}
      <ellipse cx="60" cy="108" rx="10" ry="6" fill="#f0a0a0" opacity="0.4" />
      <ellipse cx="140" cy="108" rx="10" ry="6" fill="#f0a0a0" opacity="0.4" />
    </svg>
  );
}
