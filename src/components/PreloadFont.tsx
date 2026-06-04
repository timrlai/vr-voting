import { useTTF, type FontFamilies } from "@react-three/uikit";

const specialGothicCondensed = "/fonts/SpecialGothicCondensedOne_Regular.ttf";

type PreloadFontProps = {
  setFontFamilies: (fontFamilies: FontFamilies) => void;
};

export default function PreloadFont({ setFontFamilies }: PreloadFontProps) {
  useTTF.preload(specialGothicCondensed);
  const fontFamilies = useTTF(specialGothicCondensed);

  if (fontFamilies) {
    console.log("Font Families:", fontFamilies);
    setFontFamilies(fontFamilies);
  }

  return null;
}
