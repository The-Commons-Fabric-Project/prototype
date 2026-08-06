export default function LogoPlaceholder({ size = 72, radius = 6 }) {
  const fontSize = Math.max(8.5, size * 0.12);
  // TODO: convert the remaining style attributes to Tailwind.
  return (
    <div
      className="flex items-center justify-center text-center flex-shrink-0 bg-white border-dashed border-2 border-gray-300 text-gray-400 font-sans font-semibold p-4"
      style={{ width: size, height: size, borderRadius: radius, fontSize, lineHeight: 1.2, padding: 4, letterSpacing: 0.2 }}
    >
      [logo placeholder]
    </div>
  );
}
