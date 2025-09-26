import Image from 'next/image';

interface ThemeAwareLogoProps {
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
}

export function ThemeAwareLogo({ 
  width = 18,
  height = 18,
  alt = "ELLA Logo",
  className = ""
}: ThemeAwareLogoProps) {
  return (
    <picture className={className}>
      <source 
        srcSet="https://assets.exitwithella.io/Ella_Logomark_2C_Neg_no_border.png" 
        media="(prefers-color-scheme: dark)" 
      />
      <Image
        src="https://assets.exitwithella.io/Ella_Logomark_2C_Pos_no_border.png"
        alt={alt}
        width={width}
        height={height}
        className="inline-block"
      />
    </picture>
  );
}
