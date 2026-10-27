const port=Number(process.env.PORT??4000)
if(!Number.isInteger(port)||port<1||port>65535)throw new Error('PORT must be an integer between 1 and 65535')
const webOrigins=(process.env.WEB_ORIGIN??'http://localhost:3000').split(',').map(origin=>origin.trim()).filter(Boolean)
export const env=Object.freeze({port,webOrigins})
