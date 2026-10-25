// Google's <model-viewer> web component (loaded from a script tag, see ProductGallery).
import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        "camera-controls"?: boolean | "";
        "auto-rotate"?: boolean | "";
        ar?: boolean | "";
        "shadow-intensity"?: string;
        loading?: "auto" | "lazy" | "eager";
      };
    }
  }
}
