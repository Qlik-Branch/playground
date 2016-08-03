module.exports = {
  github:{
    id: "github",
    name: "GitHub",
    directory: "github-dictionary-master",
    endpoint: "https://api.github.com",
    description: "All your GitHub repos, issues and stars.",
    dictionary: "/dictionaries/github/dictionary.json",
    icon: "/dictionaries/github/icon.png",
    loadscript: "Users:LOAD *; SQL SELECT * FROM User;Repos:LOAD *; SQL SELECT * FROM Repos;",
    projects: [
      "basic-engine-template",
      "github-search-template"
    ]
  },
  untappd:{
    id: "untappd",
    name: "Untappd",
    directory: "untappd-checkins-master",
    endpoint: "https://api.untappd.com",
    description: "All your GitHub repos, issues and stars.",
    dictionary: "/dictionaries/untappd/dictionary.json",
    icon: "/dictionaries/untappd/icon.png",
    loadscript: "
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

      Drop field [Checkin Date];
      Drop field [Badge Date];
      Drop field [Comment Date];
      Drop field [Toast Date];
    ",
    projects: [
      "basic-engine-template",
      "untappd-capability-dashboard"
    ]
  }
}
