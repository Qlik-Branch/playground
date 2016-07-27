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
    directory: "untappd-dictionary-master",
    endpoint: "https://api.untappd.com",
    description: "All your GitHub repos, issues and stars.",
    dictionary: "/dictionaries/untappd/dictionary.json",
    icon: "/dictionaries/untappd/icon.png",
    loadscript: " MyInfo:Load *;SQL Select * From MyInfo; MyBeers:Load *;SQL Select * From MyBeers; MyBadges:Load *;SQL Select * From MyBadges; ",
    projects: [
      "basic-engine-template",
      "untappd-capability-dashboard"
    ]
  }
}
