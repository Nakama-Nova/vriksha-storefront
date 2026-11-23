// The shop's server is switched off overnight to save money (stops at midnight India time, starts again at about
// 04:55 and takes a few minutes to be ready). When it cannot be reached in that window, people are told so in plain words
// instead of seeing a confusing error. If the owner changes the schedule, change the two times below.

export const CLOSES_AT_MINUTES = 0; // midnight, India time
export const REOPENS_AT_MINUTES = 5 * 60 + 15; // 05:15: the server starts at 04:55 and needs a few minutes

const IST_OFFSET_MINUTES = 5 * 60 + 30;

/** True between midnight and about 05:15 in India, when the server is normally switched off. */
export function isOvernight(now: Date = new Date()): boolean {
  const minutes = (now.getUTCHours() * 60 + now.getUTCMinutes() + IST_OFFSET_MINUTES) % (24 * 60);
  return minutes >= CLOSES_AT_MINUTES && minutes < REOPENS_AT_MINUTES;
}

/** Said when the server cannot be reached during the overnight window (an order, a form, tracking...). */
export const OVERNIGHT_NOTICE = "Our online shop rests overnight and reopens at about 5 am India time. Please try again then.";

/**
 * For pages that are built ahead of time and kept for a minute: a notice that is right whenever it is read, because
 * the page may be built at night and still be shown after the shop has reopened.
 */
export const CATALOGUE_NOTICE =
  "Our online shop rests overnight, from midnight to about 5 am India time. If it is later than that, please refresh in a moment, or call us.";
