const mailJet = require('node-mailjet').connect(process.env.MAILJET_PUBLIC_API, process.env.MAILJET_PRIVATE_API)

const welcomeEmail = (email, name) => {
    mailJet.post("send", {'version': 'v3.1'}).request({
        "Messages" : [{
            "From" : {
                "Email" : "eugenianenye@gmail.com",
                "Name" : "Eugenia"
            },
            "To" : [{
                "Email" : `${email}`,
                "Name" : `${name}`,
            }] ,
        "Subject": `Greetings ${name}!`,
        "TextPart": "My first NodeJS Email",
        "HTMLPart": "<h3>Dear Eugenia, welcome to my Newsletters!</h3><br/>May the delivery force be with you!",
        "CustomID": "AppGettingStartedTest"
    }]
    }).then((result)=>{return console.log(result.body)})
   .catch((e)=> {return console.log(e.statusCode)})
}



const cancelEmail = (email, name) => {
    mailJet.post("send", {'version': 'v3.1'}).request({
        "Messages" : [{
            "From" : {
                "Email" : "eugenianenye@gmail.com",
                "Name" : "Eugenia"
            },
            "To" : [{
                "Email" : `${email}`,
                "Name" : `${name}`,
            }] ,
        "Subject": `Greetings ${name}!`,
        "TextPart": "",
        "HTMLPart": "<h3>Hey There!</h3>Is there anything we can do to make you stay?",
        "CustomID": "AppGettingStartedTest"
    }]
    }).then((result)=>{return console.log(result.body)})
   .catch((e)=> {return console.log(e.statusCode)})
}



module.exports = {
    welcomeEmail,
    cancelEmail

}
