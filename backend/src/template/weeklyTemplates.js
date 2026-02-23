export function weeklyMoviesTemplate({
  movies = [],
  title = "",
  introText = "5 Things to Watch This Week",
  brandName = "Reel Box",
  year = new Date().getFullYear(),
  addressLine = "677 Adabor,Dhaka,Bangladesh",
  prefsLink = "#",
  unsubscribeLink
}) {
  // ---------- Helpers ----------
  const img = (path) =>
    path
      ? `https://image.tmdb.org/t/p/w500${path}`
      : "https://via.placeholder.com/500x750?text=No+Image";

  const toTitle = (m) => m?.title || m?.name || "Untitled";
  const toDate = (m) => m?.release_date || m?.first_air_date || "N/A";

  const toRating = (m) => {
    if (m.imdb_rating != null) return Number(m.imdb_rating).toFixed(1);
    if (m.vote_average != null) return Number(m.vote_average).toFixed(1); // fallback
    return "N/A";
  };

  const toOverview = (m) =>
    m?.overview?.length > 180
      ? m.overview.slice(0, 180) + "..."
      : m?.overview || "No description available.";

  // Movie vs TV link
  const tmdbLink = (m) => {
    if (!m?.id) return "#";
    const isTv = !!m.first_air_date && !m.release_date;
    return isTv
      ? `https://www.themoviedb.org/tv/${m.id}`
      : `https://www.themoviedb.org/movie/${m.id}`;
  };

  // ---------- Data prep ----------
  // const sorted = [...movies].sort((a, b) => (b?.vote_average ?? 0) - (a?.vote_average ?? 0));
  const sorted = [...movies].sort(
    (a, b) => (b.imdb_rating ?? 0) - (a.imdb_rating ?? 0)
  );

  const getImdb = (m) => {
    const v =
      m?.imdb_rating ??
      m?.imdbRating ??
      null;

    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };


  const valid = (movies || []).filter((m) => getImdb(m) != null);


  valid.sort((a, b) => getImdb(b) - getImdb(a));


  const top5 = valid.slice(0, 5);

  // Thumbnails: top 3 posters
  const thumbs = top5.slice(0, 3).map((m) => ({
    poster: img(m.poster_path),
    alt: toTitle(m),
    link: tmdbLink(m),
  }));

  // ---------- Card (same design for all) ----------
  const featureCardHTML = (m, labelText) => {
    const link = tmdbLink(m);

    return `
      <tr>
        <td align="center" style="padding:0 10px 18px 10px;">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0"
            style="width:560px; max-width:560px; background:#ffffff; border-radius:12px; overflow:hidden;">
            <tr>
              <td class="px" style="padding:16px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <!-- Poster -->
                    <td class="stack" width="180" valign="top" style="width:180px; padding-right:14px;">
                      <a href="${link}" target="_blank" style="text-decoration:none;">
                        <img class="poster" src="${img(m.poster_path)}" width="170" alt="${toTitle(m)} poster"
                          style="display:block; width:170px; max-width:170px; border-radius:12px; border:0;" />
                      </a>
                    </td>

                    <!-- Details -->
                    <td class="stack" valign="top" style="padding-top:2px;">
                      <div style="font-size:12px; font-weight:700; color:#777777; letter-spacing:0.2px; text-transform:uppercase;">
                        ${labelText}
                      </div>
 
                      <div style="font-size:22px; font-weight:900; color:#111111; margin-top:6px;">
                        ${toTitle(m)}
                      </div>

                      <div style="font-size:12px; color:#666666; margin-top:6px;">
                        ${toDate(m)}
                      </div> 

                      <div style="margin-top:10px; font-size:14px; color:#111111; font-weight:700;">
                        <span style="color:#f5c518; font-size:16px;">★</span>
                        <span style="font-size:16px;">${toRating(m)}</span>
                        <span style="color:#777777; font-weight:600;"> / 10</span>
                      </div>

                      <div style="font-size:14px; line-height:1.6; color:#333333; margin-top:10px;">
                        ${toOverview(m)}
                      </div>

                      <div style="margin-top:14px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="btn">
                          <tr>
                            <td align="center" bgcolor="#f5c518" style="border-radius:999px;">
                              <a href="${link}" target="_blank"
                                style="display:inline-block; padding:12px 22px; font-size:14px; font-weight:800; color:#111111; text-decoration:none; border-radius:999px;">
                                Learn more
                              </a>
                            </td>
                          </tr>
                        </table>
                      </div>

                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  };

  // ---------- Build cards for #1..#5 ----------
  const cardsHTML = top5
    .map((m, index) => {
      const rank = index + 1;
      const label = rank === 1 ? " " : ` `;
      return featureCardHTML(m, label);
    })
    .join("");


  // ---------- Render ----------
  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${title}</title>
  <style>
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .px { padding-left: 16px !important; padding-right: 16px !important; }
      .stack { display: block !important; width: 100% !important; }
      .thumb { width: 100% !important; height: auto !important; }
      .thumbCell { padding: 0 0 12px 0 !important; }
      .poster { width: 140px !important; }
      .btn { width: 100% !important; }
    }
  </style>
</head>

<body style="margin:0; padding:0; background:#eeeeee; font-family: Arial, Helvetica, sans-serif; color:#111111;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">
    ${title} • Top picks this week
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#eeeeee;">
    <tr>
      <td align="center" style="padding:24px 10px;">
        <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0"
          style="width:600px; max-width:600px; background:#f3f3f3; border-radius:10px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#111111; padding:18px 16px;">
              <div style="font-size:30px; font-weight:900; letter-spacing:0.5px; color:#f5c518; line-height:1;">
                IMDb
              </div>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td class="px" style="padding:18px 24px 10px 24px; background:#f3f3f3;">
              <div style="font-size:22px; font-weight:800; color:#111111;"> ${title}</div>
            </td>
          </tr>

          <!-- Thumbnails (top 3) -->
          ${thumbs.length
      ? `
          <tr>
            <td class="px" style="padding:10px 24px 10px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  ${thumbs
        .map((t, i) => {
          const pad =
            i === 0 ? "padding-right:8px;"
              : i === 1 ? "padding:0 4px;"
                : "padding-left:8px;";
          return `
                        <td class="thumbCell" width="33.33%" style="${pad}">
                          <a href="${t.link}" target="_blank" style="text-decoration:none;">
                            <img class="thumb" src="${t.poster}" width="176" alt="${t.alt}"
                              style="display:block; width:100%; max-width:176px; border-radius:10px; border:0;"/>
                          </a>
                        </td>
                      `;
        })
        .join("")}
                </tr>
              </table>
            </td>
          </tr>
          `
      : ``
    }

          <!-- Intro -->
          <tr>
            <td class="px" style="padding:6px 24px 18px 24px;">
              <div style=" font-size:38px; font-weight:500; line-height:1.3; color:#111111; letter-spacing:-0.2px;">
                ${introText}
              </div>
            </td>
          </tr>

          <!-- All cards (same design) -->
          ${cardsHTML}

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:18px 24px; background:#f3f3f3;">
              <div style="font-size:13px; color:#666666; line-height:1.6;">
                <a href="${prefsLink}" style="color:#1a73e8; text-decoration:none;">Update your email preferences</a>
                &nbsp;|&nbsp;
                <a href="${unsubscribeLink}"
                  target="_blank"
                  rel="noopener noreferrer"

                 style="color:#1a73e8; text-decoration:none;">Click here to unsubscribe</a>
              </div>

              <div style="font-size:12px; color:#888888; margin-top:14px; line-height:1.6;">
                You’re receiving this email because you subscribed to <strong style="color:#333333;">${brandName}</strong>.<br/>
                Copyright © ${year} ${brandName}, All Rights Reserved.<br/>
                ${addressLine}
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
