# Portal traffic distribution and UTM links

## Purpose

Every external placement should lead to the most relevant portal page and use a stable UTM convention. This makes YouTube, LinkedIn, and GitHub traffic distinguishable in Google Analytics without changing article content.

## Naming convention

- `utm_source`: platform (`youtube`, `linkedin`, `github`)
- `utm_medium`: channel type (`video`, `social`, `referral`, `channel`)
- `utm_campaign`: stable topic identifier (`mlcc_distortion_meter`, `an001_mlcc_distortion`)
- `utm_content`: placement (`description`, `pinned_comment`, `post`, `profile`, `readme`)

Use lowercase ASCII and underscores. Do not change a campaign name after publication.

## MLCC distortion meter engineering note

YouTube video description:

`https://highsnr.org/lab-notes/mlcc-distortion-meter-functional-architecture/?utm_source=youtube&utm_medium=video&utm_campaign=mlcc_distortion_meter&utm_content=description`

YouTube pinned comment:

`https://highsnr.org/lab-notes/mlcc-distortion-meter-functional-architecture/?utm_source=youtube&utm_medium=video&utm_campaign=mlcc_distortion_meter&utm_content=pinned_comment`

LinkedIn personal post:

`https://highsnr.org/lab-notes/mlcc-distortion-meter-functional-architecture/?utm_source=linkedin&utm_medium=social&utm_campaign=mlcc_distortion_meter&utm_content=post`

GitHub README:

`https://highsnr.org/lab-notes/mlcc-distortion-meter-functional-architecture/?utm_source=github&utm_medium=referral&utm_campaign=mlcc_distortion_meter&utm_content=readme`

## Application Note AN-001

YouTube video description:

`https://highsnr.org/application-notes/an-001/?utm_source=youtube&utm_medium=video&utm_campaign=an001_mlcc_distortion&utm_content=description`

LinkedIn personal post:

`https://highsnr.org/application-notes/an-001/?utm_source=linkedin&utm_medium=social&utm_campaign=an001_mlcc_distortion&utm_content=post`

## Profile links

YouTube channel profile:

`https://highsnr.org/?utm_source=youtube&utm_medium=channel&utm_campaign=profile&utm_content=profile_link`

LinkedIn profile featured link:

`https://highsnr.org/publications/?utm_source=linkedin&utm_medium=social&utm_campaign=profile&utm_content=featured_link`

## Weekly measurement

Review GA4 acquisition by `session source / medium` and campaign. For each placement record sessions, engaged sessions, downloads, tool launches, and internal `select_content` events. Compare Search Console separately because search impressions and clicks occur before the site visit.
