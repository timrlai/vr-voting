import { type FontFamilies } from "@react-three/uikit";

const specialGothicCondensed =
  "/fonts/SpecialGothicCondensedOne_Regular_subset_msdf.json";

type PreloadFontProps = {
  setFontFamilies: (fontFamilies: FontFamilies) => void;
};

export default function PreloadFont({ setFontFamilies }: PreloadFontProps) {
  const fontFamilies = {
    gothic: {
      regular: specialGothicCondensed,
    },
  };

  if (fontFamilies) {
    console.log("Font Families:", fontFamilies);
    setFontFamilies(fontFamilies);
  }

  return null;
}
