const config = require('../../config')
const Marketo = require('node-marketo-rest')

module.exports = {
  updateIncentive: (user) => {
    return new Promise((resolve, reject) => {
      try {
        if(config.marketo == null) {
          resolve(false)
        } else {
          const marketo = new Marketo(config.marketo)
          const testLead = {
            email: user.email,
            Incentive__c: 'WEB - Playground'
          }
          marketo.lead.createOrUpdate([testLead])
              .then(() => { resolve(true) })
              .catch((err) => {
                console.log("ISSUE WITH MARKETO", err)
                resolve(false)
              })
        }
      } catch(e) {
        console.log("ISSUE WITH MARKETO", e)
        resolve(false)
      }
    })
  }
}
