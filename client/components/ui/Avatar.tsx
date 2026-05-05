export default function Avatar({ name }: { name: string }) {
  const initial = name?.charAt(0).toUpperCase();

  const getColor = () => {0
    const colors = [
      "bg-red-400",
      "bg-blue-400",
      "bg-green-400",
      "bg-yellow-400",
      "bg-purple-400",
      "bg-pink-400",
      "bg-indigo-400"
    ];

    let hash = 0;

    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash % colors.length)];
  };

  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold border-2 border-white ${getColor()}`}
    >
      {initial}
    </div>
  );
}