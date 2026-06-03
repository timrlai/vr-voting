import { useTTF, type FontFamilies } from "@react-three/uikit";

const specialGothicCondensed = "/fonts/SpecialGothicCondensedOne_Regular.ttf";

type PreloadFontProps = {
  setFontFamilies: (fontFamilies: FontFamilies) => void;
};

export default function PreloadFont({ setFontFamilies }: PreloadFontProps) {
  const fontFamilies = useTTF(specialGothicCondensed);

  if (fontFamilies) setFontFamilies(fontFamilies);

  return null;
}
