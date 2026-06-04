import { useTTF, type FontFamilies } from "@react-three/uikit";

const specialGothicCondensed = "/fonts/Roboto_VariableFont_wdth,wght.ttf";

type PreloadFontProps = {
  setFontFamilies: (fontFamilies: FontFamilies) => void;
};

export default function PreloadFont({ setFontFamilies }: PreloadFontProps) {
  const fontFamilies = useTTF(specialGothicCondensed);

  if (fontFamilies) {
    console.log("Font Families:", fontFamilies);
    setFontFamilies(fontFamilies);
  }

  return null;
}
