const ua = navigator.userAgent;

// Uses a regex to match numbers <= 57                           0-9,  10-49, 50-57, greedy
export const isFirefoxLt58 = ua.match(/ Firefox\/(?:[0-9]|[1-4]\d|5[0-7])[^\d]/) !== null;

export const isSafari =
  ua.match(/ Safari\//) !== null &&
  // Opera includes Safari/ in its userAgent, so we need to avoid false
  // positives.
  ua.match(/ OPR\//) === null &&
  // Opera also includes Chrome/ in its userAgent, so excluding that seems like
  // a good idea too.
  ua.match(/ Chrome\//) === null;

export const isEdge = ua.match(/ Edge\//) !== null;

export const isIe = ua.match(/ Trident\//) !== null;
