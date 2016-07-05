module.exports = {
  untappd:{
    id: "untappd",
    name: "Untappd",
    directory: "untappd-dictionary-master",
    endpoint: "https://api.untappd.com",
    description: "Contains your checked in beers, badges and basic brewery info.",
    dictionary: "/dictionaries/untappd/dictionary.json",
    icon: "/dictionaries/untappd/icon.png",
    loadscript: "",
    clientId: "",
    clientSecret: ""
  },
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
      "basic-template",
      "github-search-template"
    ]
  }
}
