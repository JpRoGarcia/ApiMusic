const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

const key = 'bcc51381b56d497591001633c3099858';
const endpoint = 'https://api.cognitive.microsofttranslator.com';
const location = 'eastus';

async function traducirAIngles(texto) {
    try {
        const response = await axios({
            baseURL: endpoint,
            url: '/translate',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                'Ocp-Apim-Subscription-Region': location,
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
            },
            params: {
                'from': ['es'],
                'api-version': '3.0',
                'to': ['en'] // Traducción solo a inglés
            },
            data: [{
                'text': texto
            }],
            responseType: 'json'
        });

        return response.data[0].translations[0].text;
    } catch (error) {
        throw error;
    }
}

async function traducirCamposTexto(objeto) {
    const camposTraducidos = {};

    for (const clave in objeto) {
        if (typeof objeto[clave] === 'string') {
            camposTraducidos[clave] = await traducirAIngles(objeto[clave]);
        } else {
            camposTraducidos[clave] = objeto[clave];
        }
    }

    return camposTraducidos;
}

async function traducirJson(json) {
    const jsonTraducido = await Promise.all(json.map(async (objeto) => {
        const camposTraducidos = await traducirCamposTexto(objeto);
        return camposTraducidos;
    }));

    return jsonTraducido;
}

module.exports = {
    traducirAIngles,
    traducirCamposTexto,
    traducirJson
};

