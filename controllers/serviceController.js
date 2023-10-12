// serviceController.js
const axios = require('axios'); // Asegúrate de tener Axios instalado
const traductor = require('./traductorController');

class ServiceController {
  async getServices(req, res) {
    try {
      const response = await axios.get('https://6fuymuw84j.execute-api.us-east-1.amazonaws.com/Prod/services');
      const services = response.data;
      res.status(200).json(services);
    } catch (error) {
      console.error('Error al obtener la lista de servicios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getServicesEn(req, res) {
    try {
      const response = await axios.get('https://6fuymuw84j.execute-api.us-east-1.amazonaws.com/Prod/services');
      const services =  await traductor.traducirJson(response.data);
      res.status(200).json(services);
    } catch (error) {
      console.error('Error al obtener la lista de servicios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async createService(req, res) {
    try {
      const newServiceData = req.body;
      const response = await axios.post('https://6fuymuw84j.execute-api.us-east-1.amazonaws.com/Prod/services', newServiceData);
      const createdService = response.data;
      res.status(201).json(createdService);
    } catch (error) {
      console.error('Error al crear el servicio:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async deleteService(req, res) {
    const serviceID = req.query.serviceID;
    try {
      const response = await axios.delete(`https://6fuymuw84j.execute-api.us-east-1.amazonaws.com/Prod/services?serviceID=${serviceID}`);
      const deletionResult = response.data;
      res.status(200).json(deletionResult);
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new ServiceController();
