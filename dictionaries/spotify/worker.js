let request = require('request')
let mongoHelper = require('../../server/controllers/mongo-helper')
let oauth_configs = require('../../server/configs/oauth-info')
let dictionary = require('./dictionary')
let Halyard = require('halyard.js')

exports.getAccessToken = (
  responseData,
  clientId,
  clientSecret,
  userId,
  connectionId
) => {
  return new Promise((resolve, reject) => {
    let postData = responseData
    postData.grant_type = 'authorization_code'
    postData.redirect_uri = process.env.genericOAuthRedirectUrl
    let authHeader =
      'Basic ' + new Buffer(`${clientId}:${clientSecret}`).toString('base64')
    request(
      {
        url: dictionary.auth_options.oauth_token_url,
        method: 'POST',
        json: true,
        form: postData,
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      },
      (err, response, body) => {
        if (err) {
          reject(err)
        } else {
          // save auth token
          mongoHelper.getAuthToken(userId, connectionId, (err, authTokens) => {
            if (err) {
              reject('error checking auth tokens after authorisation')
            } else {
              var authTokenId
              if (authTokens && authTokens.length > 0) {
                authTokenId = authTokens[0].id
              }
              mongoHelper.saveAuthToken(
                authTokenId,
                userId,
                connectionId,
                body.access_token,
                body.refresh_token,
                function(err, result) {
                  resolve()
                }
              )
            }
          })
        }
      }
    )
  })
}

exports.createLoadScript = connectionInfo => {
  return new Promise((resolve, reject) => {
    mongoHelper.getAuthToken(
      connectionInfo.userid,
      connectionInfo.connection,
      (err, authToken) => {
        let postData = {
          grant_type: 'refresh_token',
          refresh_token: authToken.refreshToken
        }
        let authHeader =
          'Basic ' +
          new Buffer(
            `${oauth_configs.spotify.clientId}:${oauth_configs.spotify
              .clientSecret}`
          ).toString('base64')
        request(
          {
            url: dictionary.auth_options.oauth_token_url,
            method: 'POST',
            json: true,
            form: postData,
            headers: {
              Authorization: authHeader,
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          },
          (err, response, body) => {
            if (err) {
              reject(err)
            } else {
              // update the token in the db
              mongoHelper.saveAuthToken(
                authToken.id,
                connectionInfo.userid,
                connectionInfo.connection,
                body.access_token,
                authToken.refreshToken,
                function(err, result) {
                  let script = generateLoadScript(body.access_token)
                  resolve(script)
                }
              )
            }
          }
        )
      }
    )
  })
}

let generateLoadScript = accessToken => {
  return new Promise((resolve, reject) => {
    request(
      {
        url: 'https://api.spotify.com/v1/me/top/tracks',
        headers: { Authorization: 'Bearer ' + accessToken },
        json: true,
        qs: {
          limit: 50,
          time_range: 'short_term'
        }
      },
      (err, response, body) => {
        if (err) {
          reject(err)
          return
        }
        var tracks = []
        function track(album, artists, duration, name, popularity, rank) {
          this.album = album
          this.artists = artists
          this.duration = duration
          this.name = name
          this.popularity = popularity
          this.rank = rank
        }
        for (var i = 0; i < body.items.length; i++) {
          tracks.push(
            new track(
              body.items[i].album.name,
              body.items[i].artists[0].name,
              body.items[i].duration_ms,
              body.items[i].name,
              body.items[i].popularity,
              i
            )
          )
        }
        const halyard = new Halyard()
        if (tracks.length > 0)
          halyard.addTable(new Halyard.Table(tracks, 'tracks'))
        getArtistsInfo(accessToken).then(tables => {
          tables.forEach(table => {
            halyard.addTable(table)
          })
        })

        resolve(halyard.getScript())
      }
    )
  })
}

let getArtistsInfo = (accessToken) => {
  return new Promise((resolve, reject) => {
    request(
      {
        url: 'https://api.spotify.com/v1/me/top/artists',
        headers: { Authorization: 'Bearer ' + accessToken },
        json: true,
        qs: {
          limit: 15,
          time_range: 'short_term'
        }
      },
      (err, response, data) => {
        var artists = []
        var artistGenres = []
        var albums = []
        var albumGenres = []
        function artist(
          artistFollower,
          artistImageUrl,
          artistName,
          artistPopularity,
          albumCount
        ) {
          this.artistFollower = artistFollower
          this.artistImageUrl = artistImageUrl
          this.artistName = artistName
          this.artistPopularity = artistPopularity
          this.albumCount = albumCount
        }
        function artistGenre(artistName, artistGenre) {
          this.artistName = artistName
          this.artistGenre = artistGenre
        }
        var allOb = []
        data.items.forEach(item => {
          for (var j = 0; j < item.genres.length; j++) {
            artistGenres.push(new artistGenre(item.name, item.genres[j]))
          }
          allOb.push(
            request(
              {
                url:
                  'https://api.spotify.com/v1/artists/' + item.id + '/albums',
                headers: { Authorization: 'Bearer ' + accessToken },
                json: true,
                qs: {
                  limit: 5,
                  time_range: 'short_term'
                }
              },
              (err, response, body) => {
                console.log("ARTIST ALBUM DATA", body)
                artists.push(
                  new artist(
                    item.followers.total,
                    item.images[0],
                    item.name,
                    item.popularity,
                    body.total
                  )
                )
              }
            )
          )
        })
        Promise.all(allOb).then(() => {
          let tables = []
          if (artists.length > 0)
            tables.push(new Halyard.Table(artists, 'artists'))
          if (artistGenres.length > 0)
            tables.push(new Halyard.Table(artistGenres, 'artistGenres'))
          resolve(tables)
        })
      }
    )
  })
}
