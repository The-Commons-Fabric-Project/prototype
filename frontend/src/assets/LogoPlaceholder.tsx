export default function LogoPlaceholder({ size = 72, radius = 6 }) {
  const fontSize = Math.max(8.5, size * 0.12);
  return (
    <div
      className={`flex items-center justify-center text-center shrink-0 bg-white border-dashed border-2 border-gray-300 text-gray-400 font-sans font-semibold p-4 
        rounded-[${radius}px]
        w-[${size}px] h-[${size}px]
        font-[${fontSize}]
      tracking-wide leading-0.5
      `}
    >
      [logo placeholder]
    </div>
  );
}
