import Image from "next/image";

export default function DuoMascot() {
  return (
    <div className="flex justify-center gap-4">
      <Image
        src="/tralalero-tralala.png"
        alt="Logo 1"
        width={150}
        height={38}
        priority
      />
      <Image
        src="/Cappuccino_Assassino.png"
        alt="Logo 2"
        width={150}
        height={38}
        priority
      />
    </div>
  );
}
