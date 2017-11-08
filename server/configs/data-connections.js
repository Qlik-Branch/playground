let SpotifyWorker = require('../../dictionaries/spotify/worker')

module.exports = {
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    directory: 'spotify-dictionary-master',
    endpoint: 'https://api.spotify.com/v1/',
    description:
      'Connecting to this dataset will grab all of your GitHub repositories, issues and stars.',
    dictionary: '/dictionaries/spotify/dictionary.json',
    icon: '/dictionaries/spotify/icon.png',
    getAccessToken: SpotifyWorker.getAccessToken,
    loadscript: SpotifyWorker.createLoadScript,
    reloadscript: SpotifyWorker.createLoadScript,
    projects: [
      'basic-engine-template',
      'playground-capabilities-template',
      'playground-natural-language-vis'
    ]
  },
  github:{
    id: "github",
    name: "GitHub",
    directory: "github-dictionary-master",
    endpoint: "https://api.github.com",
    description: "Connecting to this dataset will grab all of your GitHub repositories, issues and stars.",
    dictionary: "/dictionaries/github/dictionary.json",
    icon: "/dictionaries/github/icon.png",
    loadscript: "Users:LOAD *; SQL SELECT * FROM User;Repos:LOAD *; SQL SELECT * FROM Repos;",
    projects: [
      "basic-engine-template",
      "playground-capabilities-template",
      "playground-natural-language-vis"
    ]
  },
  untappd:{
    id: "untappd",
    name: "Untappd",
    directory: "untappd-checkins-master",
    endpoint: "https://api.untappd.com",
    description: "Connect to your Untappd account to access data on your rated beers, badges and toasts.",
    dictionary: "/dictionaries/untappd/dictionary.json",
    icon: "/dictionaries/untappd/icon.png",
    loadscript: `
      MonthMap:
      Mapping Load * Inline [Month, Num
      Jan, 1
      Feb, 2
      Mar, 3
      Apr, 4
      May, 5
      Jun, 6
      Jul, 7
      Aug, 8
      Sep, 9
      Oct, 10
      Nov, 11
      Dec, 12
      ];

      MyCheckins:
      Load *,
      [Venue Lng]&','&[Venue Lat] as [Venue GeoPoint],
      [Brewery Lng]&','&[Brewery Lat] as [Brewery GeoPoint],
      Date(Num(CheckinDate) + Num(CheckinTime)) as CheckinDateTime,
      Year(CheckinDate) as CheckinYear,
      Month(CheckinDate) as CheckinMonth,
      Year(CheckinDate) & '-' & Month(CheckinDate) as CheckinMonthYear;
      Load *,
      MakeDate(Subfield([Checkin Date], ' ', 4), ApplyMap('MonthMap', Subfield([Checkin Date], ' ', 3)), Subfield([Checkin Date], ' ', 2)) as CheckinDate,
      MakeTime(Subfield(Subfield([Checkin Date], ' ', 5), ':', 1), Subfield(Subfield([Checkin Date], ' ', 5), ':', 2), Subfield(Subfield([Checkin Date], ' ', 5), ':', 3)) as CheckinTime;
      Load *;
      SQL Select * From MyCheckins cache;

      CheckinBadges:
      Load *,
      Date(Num(BadgeDate) + Num(BadgeTime)) as BadgeDateTime,
      Year(BadgeDate) as BadgeYear,
      Month(BadgeDate) as BadgeMonth,
      Year(BadgeDate) & '-' & Month(BadgeDate) as BadgeMonthYear;
      Load *,
      MakeDate(Subfield([Badge Date], ' ', 4), ApplyMap('MonthMap', Subfield([Badge Date], ' ', 3)), Subfield([Badge Date], ' ', 2)) as BadgeDate,
      MakeTime(Subfield(Subfield([Badge Date], ' ', 5), ':', 1), Subfield(Subfield([Badge Date], ' ', 5), ':', 2), Subfield(Subfield([Badge Date], ' ', 5), ':', 3)) as BadgeTime;
      Load *;
      SQL Select * From CheckinBadges;

      CheckinMedia:
      Load *;
      SQL Select * From CheckinMedia;

      CheckinComments:
      Load *,
      Date(Num(CommentDate) + Num(CommentTime)) as CommentDateTime,
      Year(CommentDate) as CommentYear,
      Month(CommentDate) as CommentMonth,
      Year(CommentDate) & '-' & Month(CommentDate) as CommentMonthYear;
      Load *,
      MakeDate(Subfield([Comment Date], ' ', 4), ApplyMap('MonthMap', Subfield([Comment Date], ' ', 3)), Subfield([Comment Date], ' ', 2)) as CommentDate,
      MakeTime(Subfield(Subfield([Comment Date], ' ', 5), ':', 1), Subfield(Subfield([Comment Date], ' ', 5), ':', 2), Subfield(Subfield([Comment Date], ' ', 5), ':', 3)) as CommentTime;
      Load *;
      SQL Select * From CheckinComments;

      CheckinToasts:
      Load *,
      Date(Num(ToastDate) + Num(ToastTime)) as ToastDateTime,
      Year(ToastDate) as ToastYear,
      Month(ToastDate) as ToastMonth,
      Year(ToastDate) & '-' & Month(ToastDate) as ToastMonthYear;
      Load *,
      MakeDate(Subfield([Toast Date], ' ', 4), ApplyMap('MonthMap', Subfield([Toast Date], ' ', 3)), Subfield([Toast Date], ' ', 2)) as ToastDate,
      MakeTime(Subfield(Subfield([Toast Date], ' ', 5), ':', 1), Subfield(Subfield([Toast Date], ' ', 5), ':', 2), Subfield(Subfield([Toast Date], ' ', 5), ':', 3)) as ToastTime;
      Load *;
      SQL Select * From CheckinToasts;

      Tag FIELDS Rating, [Author Rating], [Beer ABV], [Comment Count], [Badge Count], [Toast Count] WITH $measure;

      Tag FIELDS Venue WITH $geoname;
      Tag FIELDS [Venue GeoPoint] WITH $geopoint;

      Tag FIELDS Brewery WITH $geoname;
      Tag FIELDS [Brewery GeoPoint] WITH $geopoint;

      Drop field [Checkin Date];
      Drop field [Badge Date];
      Drop field [Comment Date];
      Drop field [Toast Date];
    `,
    projects: [
      "basic-engine-template",
      "playground-capabilities-template",
      "playground-natural-language-vis",
      "untappd-capability-dashboard"
    ]
  },
  twitter:{
    id: "twitter",
    name: "Twitter",
    directory: "twitter-dictionary-master",
    endpoint: "https://api.twitter.com",
    description: "This dataset will contain your last 1000 tweets, if you have that many of course.",
    dictionary: "/dictionaries/twitter/dictionary.json",
    icon: "/dictionaries/twitter/icon.png",
    loadscript: `
      Let vCount = 20;
      MonthMap:
      Mapping Load * Inline [Month, Num
      Jan, 1
      Feb, 2
      Mar, 3
      Apr, 4
      May, 5
      Jun, 6
      Jul, 7
      Aug, 8
      Sep, 9
      Oct, 10
      Nov, 11
      Dec, 12
      ];

      TweetsTemp:
      Load *, 'tweet' as tweetstemp;
      SQL SELECT *
      FROM UserTimeline
      WHERE ?count=$(vCount)
      Cache;

      Let vMinId = Peek('TweetId', -1, 'TweetsTemp');

      TweetsTemp2:
      Load *, 'dummy' as dummy;
      Select *
      FROM UserTimeline
      WHERE ?count=$(vCount)&max_id=$(vMinId)
      Cache;

      Concatenate (TweetsTemp)
      Load *
      Resident TweetsTemp2
      Where TweetId <> $(vMinId);

      Drop Table TweetsTemp2;

      Let vMinId = Peek('TweetId', -1, 'TweetsTemp');

      TweetsTemp3:
      Load *, 'dummy' as dummy;
      Select *
      FROM UserTimeline
      WHERE ?count=$(vCount)&max_id=$(vMinId)
      Cache;

      Concatenate (TweetsTemp)
      Load *
      Resident TweetsTemp3
      Where TweetId <> $(vMinId);

      Drop Table TweetsTemp3;

      Let vMinId = Peek('TweetId', -1, 'TweetsTemp');

      TweetsTemp4:
      Load *, 'dummy' as dummy;
      Select *
      FROM UserTimeline
      WHERE ?count=$(vCount)&max_id=$(vMinId)
      Cache;

      Concatenate (TweetsTemp)
      Load *
      Resident TweetsTemp4
      Where TweetId <> $(vMinId);

      Drop Table TweetsTemp4;

      Let vMinId = Peek('TweetId', -1, 'TweetsTemp');

      TweetsTemp5:
      Load *, 'dummy' as dummy;
      Select *
      FROM UserTimeline
      WHERE ?count=$(vCount)&max_id=$(vMinId)
      Cache;

      Concatenate (TweetsTemp)
      Load *
      Resident TweetsTemp5
      Where TweetId <> $(vMinId);

      Drop Table TweetsTemp5;

      Let vMinId = Peek('TweetId', -1, 'TweetsTemp');

      TweetsTemp6:
      Load *, 'dummy' as dummy;
      Select *
      FROM UserTimeline
      WHERE ?count=5&max_id=$(vMinId)
      Cache;

      Concatenate (TweetsTemp)
      Load *
      Resident TweetsTemp6
      Where TweetId <> $(vMinId);

      Drop Table TweetsTemp6;

      Tweets:
      Load *,
      Date(Num(TweetDate) + Num(TweetTime)) as [Tweet DateTime],
      Year(TweetDate) as [Tweet Year],
      Month(TweetDate) as [Tweet Month],
      Year(TweetDate) & '-' & Month(TweetDate) as [Tweet MonthYear],
      Date(Num(JoinDate) + Num(JoinTime)) as [Join DateTime],
      Year(JoinDate) as [Join Year],
      Month(JoinDate) as [Join Month],
      Year(JoinDate) & '-' & Month(JoinDate) as [Join MonthYear];
      Load *,
      MakeDate(Subfield([Tweet Date], ' ', 6), ApplyMap('MonthMap', Subfield([Tweet Date], ' ', 2)), Subfield([Tweet Date], ' ', 3)) as TweetDate,
      MakeTime(Subfield(Subfield([Tweet Date], ' ', 4), ':', 1), Subfield(Subfield([Tweet Date], ' ', 4), ':', 2), Subfield(Subfield([Tweet Date], ' ', 4), ':', 3)) as TweetTime,
      MakeDate(Subfield([Join Date], ' ', 6), ApplyMap('MonthMap', Subfield([Join Date], ' ', 2)), Subfield([Join Date], ' ', 3)) as JoinDate,
      MakeTime(Subfield(Subfield([Join Date], ' ', 4), ':', 1), Subfield(Subfield([Join Date], ' ', 4), ':', 2), Subfield(Subfield([Join Date], ' ', 4), ':', 3)) as JoinTime;
      Load *
      Resident TweetsTemp;

      Drop Table TweetsTemp;
      Drop Field dummy;
      Drop Field tweetstemp;

      Tag FIELDS Followers, Following, [Listed Count], Favourites, Retweeted, Favourited WITH $measure;

      Hashtags:
      LOAD *, 'hashtag' as hashtagtemp;
      SQL SELECT *
      FROM UserTimeline_Hashtags;

      Mentions:
      LOAD *, 'mention' as mentiontemp;
      SQL SELECT *
      FROM UserTimeline_UserMentions;

      Urls:
      LOAD *, 'urls' as urlstemp;
      SQL SELECT *
      FROM UserTimeline_Urls;
    `,
    projects: [
      "basic-engine-template",
      "playground-capabilities-template",
      "playground-natural-language-vis"
    ]
  }
}
