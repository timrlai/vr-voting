import { TTFLoader, type FontFamilies } from "@react-three/uikit";
import { useEffect } from "react";

const specialGothicCondensed = "/fonts/SpecialGothicCondensedOne_Regular.ttf";

type PreloadFontProps = {
  setFontFamilies: (fontFamilies: FontFamilies) => void;
};

export default function PreloadFont({ setFontFamilies }: PreloadFontProps) {
  useEffect(() => {
    const loader = new TTFLoader();
    loader.loadAsync(specialGothicCondensed).then((fontFamilies) => {
      if (fontFamilies) {
        console.log("Font Families:", fontFamilies);
        setFontFamilies(fontFamilies);
      }
    });
  }, [setFontFamilies]);

  return null;
}
