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
      "github-search-template"
    ]
  }
}
