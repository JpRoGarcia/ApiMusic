// technicianController.js
const axios = require('axios');
const traductor = require('./traductorController');

class TechnicianController {
    // Función para obtener la lista de técnicos
    async getTechnicians(req, res) {
      try {
        // Supongamos que estás usando Axios para hacer la solicitud GET.
        const response = await axios.get('https://6fuymuw84j.execute-api.us-east-1.amazonaws.com/Prod/technicians');
        const technicians = response.data;
  
        res.status(200).json(technicians);
      } catch (error) {
        console.error('Error al obtener la lista de técnicos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }

    async getTechniciansEn(req, res) {
        try {
          // Supongamos que estás usando Axios para hacer la solicitud GET.
          const response = await axios.get('https://6fuymuw84j.execute-api.us-east-1.amazonaws.com/Prod/technicians');
          const technicians = await traductor.traducirJson(response.data);

          res.status(200).json(technicians);
        } catch (error) {
          console.error('Error al obtener la lista de técnicos:', error);
          res.status(500).json({ error: 'Error interno del servidor' });
        }
      }
  
    // Función para crear un nuevo técnico
    async createTechnician(req, res) {
      try {
        // Datos del nuevo técnico a crear
        const newTechnicianData = {
          documentID: req.body.documentID,
          name: req.body.name,
          lastname: req.body.lastname,
          sector: req.body.sector,
          birthday: req.body.birthday,
          address: req.body.address,
          email: req.body.email,
          phone: req.body.phone,
        };
  
        // Supongamos que estás usando Axios para hacer la solicitud POST.
        const response = await axios.post('https://6fuymuw84j.execute-api.us-east-1.amazonaws.com/Prod/technicians', newTechnicianData);
        const createdTechnician = response.data;
  
        res.status(201).json(createdTechnician);
      } catch (error) {
        console.error('Error al crear el técnico:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  
    // Función para eliminar un técnico
    async deleteTechnician(req, res) {
      const technicianID = req.query.technicianID;
  
      try {
        // Supongamos que estás usando Axios para hacer la solicitud DELETE.
        const response = await axios.delete(`https://6fuymuw84j.execute-api.us-east-1.amazonaws.com/Prod/technicians?technicianID=${technicianID}`);
        const deletionResult = response.data;
  
        res.status(200).json(deletionResult);
      } catch (error) {
        console.error('Error al eliminar el técnico:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }
  
  module.exports = new TechnicianController();
  


