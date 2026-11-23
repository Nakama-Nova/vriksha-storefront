// What real customers have said about their pieces. The home page shows this section only when the list below has
// at least one entry, so an empty list means no section (nothing is made up).
//
// To add one: copy the example into the list, fill it in, and merge to `main`; the site deploys itself.
// Only add a comment the customer wrote or said to you, and only with their OK to show it and their name or first name.
//
//   {
//     name: "Ravi K.",
//     place: "Chennai",                      // optional
//     piece: "Teak King Size Bed",           // optional: what they bought
//     text: "The headboard carving is even better in person. It arrived on the day they promised.",
//   },

export type Testimonial = {
  name: string;
  place?: string;
  piece?: string;
  text: string;
};

export const TESTIMONIALS: Testimonial[] = [];
